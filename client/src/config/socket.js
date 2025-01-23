import { API_URL } from "@/constants/constant";
import socket from "socket.io-client"

let socketInstance = null;

export const initSocket = (projectId) => {
    socketInstance = socket(API_URL, {
        withCredentials: true,
        query : {
            projectId
        }
    })
    return socketInstance
}


export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data)
}
