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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



import AddCoolaborator from '@/components/AddCoolaborator'
import MessageSend from '@/components/MessageSend'
import SidePanel from '@/components/SidePanel'
import MessageContainer from '@/components/MessageContainer'
import MessageHeader from '@/components/MessageHeader'
import { Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CodeEditor from '@/components/CodeEditor'


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
    const tabRef = useRef({});

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

    useEffect(() => {
        if (tabRef.current?.[currentFile]) {
            tabRef.current[currentFile].classList.add("!bg-gray-400");
        }
    }, [currentFile])

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

                <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                    <ResizablePanel defaultSize={20} maxSize={25} >
                        <div className="explorer h-full bg-slate-100">
                            <div className="file-tree w-full">
                                {Object.keys(fileTree).map((file, index) => (
                                    <button key={index}
                                        className={`tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full ${currentFile === file ? "!bg-slate-400" : "!bg-slate-200"}`}
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
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={80} minSize={75} >
                        <div className="code-editor flex flex-col flex-grow h-full shrink">
                            <div className="top flex justify-between w-full">
                                <Tabs defaultValue={null} className="w-full">
                                    <TabsList className="flex items-center justify-start gap-1 w-full rounded-none bg-slate-100">
                                        {openFiles.map((file, index) => (
                                            <TabsTrigger
                                                ref={(el) => {
                                                    if (el) tabRef.current[file] = el;
                                                }}
                                                key={index}
                                                
                                                className={`open-file cursor-pointer flex items-center w-fit text-black border-[1px] ${currentFile === file ? '!bg-slate-400 border-transparent' : '!bg-slate-300 border-black'} `}
                                                onClick={() => {
                                                        setCurrentFile(file);
                                                     
                                                }}
                                            >
                                                {file} 
                                                <div className={`flex items-center justify-center ml-1 rounded-md ${currentFile === file ? "bg-slate-400 hover:bg-slate-500" : "bg-slate-300 hover:bg-slate-400"}`}>   
                                                    <X size={20} className=' p-[1px]' onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newFiles = openFiles.filter(f => f !== file)
                                                        setOpenFiles(newFiles)
                                                        if (currentFile === file) {
                                                            setCurrentFile(newFiles[newFiles.length - 1] || [])
                                                        }
                                                    }} />
                                                </div>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
    
                                <div className="actions">
                                    <Button
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
                                        className='p-2 px-3 rounded-none bg-red-600 hover:bg-red-700 text-white'
                                    >
                                        <Play />Run
                                    </Button>
                                </div>

                            </div>
                            <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                                {
                                    fileTree[currentFile] && (
                                        <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                            <CodeEditor  
                                            setFileTree={setFileTree}
                                            saveFileTree={saveFileTree}
                                            currentFile={currentFile}
                                            fileTree={fileTree}
                                            />
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