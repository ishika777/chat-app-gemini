import { Home, Plus, Users2 } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const MessageHeader = ({setIsModalOpen, isSidePanelOpen, setIsSidePanelOpen}) => {
    const navigate = useNavigate()
  return (
    <div className='flex justify-between items-center h-fit p-2 px-4 w-full bg-slate-100 top-0'>
        <div>
            <button className='hover:bg-gray-200 p-2 rounded-md' onClick={() => navigate("/")} >
                <Home />
            </button>
        </div>
        <div className='flex gap-1'>
            <button className='hover:bg-gray-200 p-2 rounded-md' onClick={() => setIsModalOpen(true)}>
                <Plus size={25} />
            </button>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 hover:bg-gray-200 rounded-md'>
                <Users2 size={25} />
            </button>
        </div>
    </div>
  )
}

export default MessageHeader