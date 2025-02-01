import { Plus, User, X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const SidePanel = ({isSidePanelOpen, setIsSidePanelOpen, setIsModalOpen}) => {

    const {project} = useSelector((state) => state.project)

  return (
    <div className={`sidePanel w-full h-full flex flex-col bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
        <div className='flex justify-between items-center px-4 py-2 bg-slate-100'>
            <div className='flex items-center gap-2'>   
                <h1 className='font-medium text-lg'>Collaborators</h1>
                <button className='hover:bg-gray-200 p-1 rounded-md' onClick={() => setIsModalOpen(true)}>
                    <Plus size={25} />
                </button>
            </div>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                <X size={35} className='hover:bg-gray-200 p-1 rounded-md' />
            </button>
        </div>
        <div className="users flex flex-col">
        {project?.users && project.users.map((user, index) => (
            <div key={index} className="user cursor-pointer hover:bg-slate-200 p-3 flex gap-2 items-center">
                <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-2 text-white bg-slate-400'>
                    <User />
                </div>
                <h1 className='font-semibold text-lg'>{user.email}</h1>
            </div>
        ))}
    </div>
    </div>
  )
}

export default SidePanel