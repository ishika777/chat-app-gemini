import React, { useEffect, useRef } from 'react'
import Markdown from 'markdown-to-jsx'
const MessageContainer = ({messageBox, messages, user, WriteAiMessage}) => {


    useEffect(() => {
        const scrollToBottom = () => {
            messageBox.current.scrollTop = messageBox.current.scrollHeight
        }
        scrollToBottom();
    }, [messages]);


    function SyntaxHighlightedCode(props) {
        const ref = useRef(null)
    
        useEffect(() => {
            if (ref.current && props.className?.includes('lang-') && window.hljs) {
                window.hljs.highlightElement(ref.current)
    
                // hljs won't reprocess the element unless this attribute is removed
                ref.current.removeAttribute('data-highlighted')
            }
        }, [ props.className, props.children ])
    
        return <code {...props} ref={ref} />
    }

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message)
        return (
            <div
                className='overflow-auto bg-blue-950 text-white rounded-sm p-2 mt-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

  return (
    <div ref={messageBox} className="message-container p-2 pb-[3.2rem] flex flex-1 min-h-[90vh] flex-col gap-2 overflow-auto">
        {messages.map((msg, index) => (
            <div key={index} className={`${msg.sender._id === 'ai' ? 'w-fit max-w-[85%]' : 'w-fit max-w-[70%]'} 
                ${msg?.sender?._id === user?._id ? 'ml-auto !bg-green-200' : ''} 
                message flex flex-col p-2 bg-slate-50 w-fit rounded-md `}
            >
                <small className='opacity-65 text-xs'>{msg.sender._id == user._id.toString() ? "" : `${msg.sender.email}`}</small>
                <div className={`text-sm ${msg.sender._id === user._id.toString() ? '' : 'mt-2'}`}>
                    {msg.sender._id === "ai" ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}
                </div>
            </div>
        ))}
    </div>
  )
}



export default MessageContainer