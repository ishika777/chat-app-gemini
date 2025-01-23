import React, { useState, useEffect } from 'react'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { setProjects } from '../store/project-slice';
import { setAllUsers } from '../store/user-slice';
import NewProject from '@/components/NewProject';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { Link, User } from 'lucide-react';

axios.defaults.withCredentials = true;


const Home = () => {

    const {user} = useSelector((state) => state.user)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ name, setName ] = useState("")
    const dispatch = useDispatch()
    const {allProjects} = useSelector((state) =>state.project)

    const navigate = useNavigate()

    // get all user's projects
    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get('/projects/all', {
                    headers : {
                        "Content-Type": "application/json"
                    }
                })
                if(response.data.success){
                    dispatch(setProjects(response.data.projects))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    // get all users
    useEffect(() => {
        const fetchAllUsers = async() => {
            try {
                const response = await axios.get(`/users/all`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if(response.data.success){
                    dispatch(setAllUsers(response.data.users))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllUsers()
    }, [])


    const createProject = async(e, name) => {
        if(name === "" || name.trim() === ""){
            toast.error("Enter Project Name")
            return; 
        }
        e.preventDefault()
        try {
            const response = await axios.post('/projects/create', {name}, {
                headers : {
                    "Content-Type": "application/json"
                }
            })
            if(response.data.success){
                setIsModalOpen(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    

    return (

        // real time updates

        <main className='p-4'>
            <div className="projects flex flex-wrap gap-3">

                <Button style={{border: "1px solid black"}} onClick={() => navigate("/logout")}>
                    Logout
                </Button>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="project p-4 border border-slate-300 rounded-md">
                    New Project
                    <Link />
                </Button>

                {
                    allProjects.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project/${project._id}`)
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200">
                            <h2
                                className='font-semibold'
                            >{project.name}</h2>

                            <div className="flex gap-2">
                                <span className='text-md relative'> <User className='absolute top-1 -right-6 *:' size={15} /> Collaborators:</span>
                                <span className='relative left-5'>{project.users.length}</span>
                            </div>

                        </div>
                    ))
                }
            </div>

            {isModalOpen && (
                <NewProject 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen}
                createProject={createProject}
                />
            )}

        </main>
    )
}

export default Home