import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import actions from "../events/actions"
import axios from '../config/axios'
import { initSocket, receiveMessage } from '../config/socket'
import { getWebContainer } from '../config/webContainer'

import { useDispatch, useSelector } from "react-redux";
import { setSingleProject } from '../store/project-slice'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


import AddCoolaborator from '@/components/AddCoolaborator'
import MessageSend from '@/components/MessageSend'
import SidePanel from '@/components/SidePanel'
import MessageContainer from '@/components/MessageContainer'
import MessageHeader from '@/components/MessageHeader'
import CodeFile from '@/components/CodeFile'


const Project = () => {

    const params = useParams();
    const projectId = params.projectId;

    const dispatch = useDispatch();
    const { project } = useSelector((state) => state.project)
    const { user, allUsers } = useSelector((state) => state.user)

    const messageBox = React.createRef()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())

    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])

    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)

    const [runProcess, setRunProcess] = useState(null)

    const [panelSize, setPanelSize] = useState(25);

    useEffect(() => {
        const getProject = async () => {
            try {
                const response = await axios.get(`/projects/get-project/${projectId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.data.success) {
                    dispatch(setSingleProject(response.data.project))
                    setFileTree(response.data.project.fileTree || {})
                }
            } catch (error) {
                console.log(error)
            }
        }
        getProject()
    }, [projectId])


    useEffect(() => {

        initSocket(projectId)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }

        receiveMessage(actions.PROJECT_MESSAGE, async (data) => {
            if (data.sender._id == 'ai') {
                const message = JSON.parse(data.message)
                await webContainer?.mount(message.fileTree)
                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [...prevMessages, data])
            } else {
                setMessages(prevMessages => [...prevMessages, data])
            }
        })
    }, [])


    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleBlur = (e) => {
        const updatedContent = e.target.innerText;
        const ft = {
            ...fileTree,
            [currentFile]: {
                file: {
                    contents: updatedContent
                }
            }
        }
        setFileTree(ft)
        saveFileTree(ft)
    }

    return (
        <main className='h-screen w-screen flex'>

            <section className="left relative flex flex-col max-h-screen min-w-96 bg-slate-300">

                <MessageHeader
                    setIsModalOpen={setIsModalOpen}
                    isSidePanelOpen={isSidePanelOpen}
                    setIsSidePanelOpen={setIsSidePanelOpen}
                />
                <MessageContainer
                    messageBox={messageBox}
                    messages={messages}
                    user={user}
                />
                <MessageSend
                    setMessages={setMessages}
                    user={user}
                />
                <SidePanel
                    isSidePanelOpen={isSidePanelOpen}
                    setIsSidePanelOpen={setIsSidePanelOpen}
                />
                {isModalOpen && (<AddCoolaborator
                    allUsers={allUsers}
                    selectedUserId={selectedUserId}
                    setSelectedUserId={setSelectedUserId}
                    isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                )}

            </section>

            <section className="right bg-red-50 flex-grow h-full flex">

                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full w-full"
                >
                    <ResizablePanel defaultSize={20} maxSize={25} >
                        <div className="explorer h-full bg-slate-200">
                            <div className="file-tree w-full">
                                {Object.keys(fileTree).map((file, index) => (
                                    <button key={index}
                                        className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
                                        onClick={() => {
                                            setCurrentFile(file)
                                            setOpenFiles([...new Set([...openFiles, file])])
                                        }}
                                    >
                                        <p className='font-semibold text-lg'>{file}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle  />
                    <ResizablePanel defaultSize={80} minSize={75} >
                        <div className="code-editor flex flex-col flex-grow h-full shrink">

                            <div className="top flex justify-between w-full">
                                <div className="files flex">
                                    {openFiles.map((file, index) => (
                                        <button key={index}
                                            className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-gray-300 ${currentFile === file ? 'bg-slate-400' : ''}`}
                                            onClick={() => setCurrentFile(file)}
                                        >
                                            <p className='font-semibold text-lg'>{file}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="actions flex gap-2">
                                    <button
                                        onClick={async () => {
                                            await webContainer.mount(fileTree)
                                            const installProcess = await webContainer.spawn("npm", ["install"])
                                            installProcess.output.pipeTo(new WritableStream({
                                                write(chunk) {
                                                    console.log(chunk)
                                                }
                                            }))
                                            if (runProcess) {
                                                runProcess.kill()
                                            }
                                            let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                                            tempRunProcess.output.pipeTo(new WritableStream({
                                                write(chunk) {
                                                    console.log(chunk)
                                                }
                                            }))
                                            setRunProcess(tempRunProcess)
                                            webContainer.on('server-ready', (port, url) => {
                                                setIframeUrl(url)
                                            })

                                            saveFileTree(fileTree)
                                        }}
                                        className='p-2 px-4 bg-red-600 text-white'
                                    >
                                        run
                                    </button>
                                </div>
                            </div>


                            <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                                {
                                    fileTree[currentFile] && (
                                        <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                            <pre
                                                className="hljs h-full">
                                                <code
                                                    className="hljs h-full outline-none"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={handleBlur}
                                                    dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                                    style={{
                                                        whiteSpace: 'pre-wrap',
                                                        paddingBottom: '25rem',
                                                        counterSet: 'line-numbering',
                                                    }}
                                                />
                                            </pre>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>


                {iframeUrl && webContainer &&
                    (<div className="flex min-w-96 flex-col h-full">
                        <div className="address-bar">
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full"></iframe>
                    </div>)
                }

            </section>


        </main>
    )
}

export default Project