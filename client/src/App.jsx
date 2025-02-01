import React, { useEffect, useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import UserAuth from "./auth/UserAuth"
import Home from "./screens/Home"
import Login from  "./screens/Login"
import Register from "./screens/Register"
import Project from "./screens/Project"
import axios from './config/axios'
import { useDispatch } from 'react-redux'
import { setUser } from './store/user-slice'
import Loader from './components/Loader'
import Logout from './components/Logout'

function App() {

    // const dispatch = useDispatch()
    // const [isCheckingAuth, setIsCheckingAuth] = useState(false);

    // useEffect(() => {
    //     const checkUser = async() => {
    //         try {
    //             setIsCheckingAuth(true);
    //             const response = await axios.get("/users/check-auth", {
    //                 headers : {
    //                     "Content-Type": "application/json"
    //                 }
    //             })
    //             if(response.data.success){
    //                 dispatch(setUser(response.data.user))
    //             }
    //         } catch (error) {
    //             setIsCheckingAuth(false)
    //             console.log(error)
    //         }finally{
    //             setIsCheckingAuth(false)
    //         }
    //     }
    //     checkUser();
    // }, [])

    // if(isCheckingAuth){
    //     return <Loader />
    // }

  return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<UserAuth><Home /></UserAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/project/:projectId" element={<UserAuth><Project /></UserAuth>} />

        </Routes>
    </BrowserRouter>
  )
}

export default App
