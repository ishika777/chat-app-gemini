import { Plus, Users2 } from 'lucide-react'
import React from 'react'

const MessageHeader = ({setIsModalOpen, isSidePanelOpen, setIsSidePanelOpen}) => {
  return (
    <div className='flex justify-end items-center h-[57] gap-1 p-2 px-4 w-full bg-slate-100 top-0'>
        <button className='flex hover:bg-gray-200 p-2 rounded-md' onClick={() => setIsModalOpen(true)}>
            <Plus size={25} />
        </button>
        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 hover:bg-gray-200 rounded-md'>
            <Users2 size={25} />
        </button>
    </div>
  )
}

export default MessageHeader