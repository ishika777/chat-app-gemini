import React, { useEffect } from 'react'
import axios from '../config/axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/user-slice';
import { useNavigate } from 'react-router-dom';

const Logout = ({children}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        const logoutHandle = async() => {
            try {
                const response = await axios.post("/users/logout", {
                    headers : {
                        "Content-Type": "application/json"
                    }
                })
                if(response.data.success){
                    dispatch(setUser(null))
                    navigate("/login")
                }
            } catch (error) {
                console.log(error)
            }
        }
        logoutHandle()
    }, [])
  return (
    <>{children}</>
  )
}

export default Logout