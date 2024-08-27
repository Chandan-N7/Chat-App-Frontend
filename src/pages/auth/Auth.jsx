import React, { useState } from 'react'
import Background from '../../assets/login2.png'
import Victory from '../../assets/victory.svg'
import { Tabs, TabsList } from '../../components/ui/tabs'
import { TabsContent, TabsTrigger } from '@radix-ui/react-tabs'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'
import apiClint from '../../lib/api-clint'
import { LOGIN_ROUTES, SIGNUP_ROUTES } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/store'

const Auth = () => {
    const navigate = useNavigate()
    const { setUserInfo } = useAppStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirPassword, setConfirPassword] = useState("")

    const validateLogin = () => {
        if (!email.length) {
            toast.error('Email is required ');
            return false;
        }
        if (!password.length) {
            toast.error('Password is required ');
            return false;
        }
        return true;
    };

    const validateSignup = () => {
        if (!email.length) {
            toast.error('Email is required ');
            return false;
        }
        if (!password.length) {
            toast.error('Password is required ');
            return false;
        }
        if (password !== confirPassword) {
            toast.error('Password and   Confirm Paaword must match');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                const response = await apiClint.post(LOGIN_ROUTES, { email, password }, { withCredentials: true });
            if (response.data.id) {
                setUserInfo(response.data)
                if (response.data.profileSetup) {
                    navigate("/chat")
                }
                else {
                    navigate("/profile")
                    
                }
            }
            else {
                
            }
            } catch (error) {
                toast.error('Invalid credentials');
                console.log("error")
            }
            
        }
    }
    const handleSignup = async () => {
        if (validateSignup()) {

            try {

                const response = await apiClint.post(SIGNUP_ROUTES, { email, password }, { withCredentials: true });
                if (response.status === 201) {
                    setUserInfo(response.data)
                    navigate("/profile")
                }
                console.log({ response })
            } catch (error) {

            }
        }
    }

    return (
        <div className="h-[95vh] w-[100%] flex justify-center items-center ">
            <div className="h-fit bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:-w[70vw] xlo:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
                <div className="flex flex-col gap-10 items-center justify-center ">
                    <div className="item-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="victory emoji" className='h-[100px]' />
                        </div>
                        <p className="font-medium text-center">Fill in the details to get started with the best chat app</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue='login'>
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login"
                                    className="data-[state=active]:bg-transparent text-black border-b-2 text-opacity-90 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">
                                    Login</TabsTrigger>


                                <TabsTrigger value="signup"
                                    className="data-[state=active]:bg-transparent text-black border-b-2 text-opacity-90 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                > Signup</TabsTrigger>
                            </TabsList>


                            <TabsContent value='login' className="flex flex-col gap-5 mt-10">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                    placeholder="password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                            </TabsContent>


                            <TabsContent value='signup' className="flex flex-col gap-5 mt-10">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />

                                <Input
                                    placeholder="password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={confirPassword}
                                    onChange={(e) => setConfirPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className=" hidden xl:flex justify-center items-center">
                    <img src={Background} alt="background login " className="h-[700px]" />
                </div>
            </div>
        </div>
    )
}

export default Auth
