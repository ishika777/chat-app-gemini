import { sendMessage } from '@/config/socket';
import actions from '@/events/actions';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { Input } from './ui/input';

const MessageSend = ({setMessages, user}) => {

    const [ message, setMessage ] = useState('')

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            if(message === "" || message.trim() === ""){
                return;
            }
          send();
        }
    };

    const send = () => {
            sendMessage(actions.PROJECT_MESSAGE, {
                message,
                sender: user
            }) 
            setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ])
            setMessage("")
        }
    

  return (
    <div onKeyDown={handleKeyPress} className='w-full flex absolute bottom-0'>
        <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Enter message"
            className="p-2 px-4 border-none outline-none flex-grow focus-visible:ring-0 rounded-none"
        />
        <Button className="rounded-none" onClick={send}><Send /></Button>
    </div>
  )
}
{/* <div onKeyDown={handleKeyPress} className="w-full flex absolute bottom-0">
<input
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' /> 
<button
    onClick={send}
    className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
</div> */}
export default MessageSend