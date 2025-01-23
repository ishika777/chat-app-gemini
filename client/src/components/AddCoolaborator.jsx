import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Toggle } from '@radix-ui/react-toggle'
import { User } from 'lucide-react'
import axios from '@/config/axios'

const AddCoolaborator = ({ addCollaborators, allUsers, selectedUserId, setSelectedUserId, isModalOpen, setIsModalOpen }) => {

    const handleToggle = (id) => {
        console.log(selectedUserId)
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            return newSelectedUserId;
        });
    }

    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="max-h-[425px]">
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="max-h-[420px] overflow-y-auto add-collab">
                <div className='flex flex-col'>
                    <DialogHeader>
                        <DialogTitle>Add Collaborators</DialogTitle>
                        <DialogDescription>
                            Select users you want to add as collaborator
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-1 flex-col gap-2 w-full my-4 overflow-y-auto'>
                        {allUsers.map(user => (
                            <Toggle key={user._id} onChange={() => handleToggle(user._id)}
                                className={`flex items-center py-3 px-3 w-full bg-gray-200 rounded-lg ${Array.from(selectedUserId).indexOf(user._id) != -1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-black'}`} >
                                <User size={20} />{" "}<span className='font-semibold text-lg ml-3'>{user.email}</span>
                            </Toggle>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={addCollaborators} type="submit">Add Collaborators</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
{/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
<div className="bg-white p-4 rounded-md w-96 max-w-full relative">
    <header className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Select User</h2>
        <button onClick={() => setIsModalOpen(false)} className='p-2'>
            <i className="ri-close-fill"></i>
        </button>
    </header>
    <div className="users-list flex flex-col mb-16 max-h-56 overflow-auto">
        {allUsers.map(user => (
            <div key={user.id} className={`user cursor-pointer hover:bg-slate-100 ${ Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-100' : ""} p-3 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                    <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className='font-semibold text-lg'>{user.email}</h1>
            </div>
        ))}
    </div>
    <button
        onClick={addCollaborators}
        className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
        Add Collaborators
    </button>
</div>
</div>  */}

export default AddCoolaborator