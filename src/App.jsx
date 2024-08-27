import React, { Children, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile'
import { useAppStore } from './store/store'
import apiClint from './lib/api-clint'
import { GET_USER_INFO } from './utils/constants'
import { HashLoader } from 'react-spinners'

const PrivateRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  console.log(isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children
}

const App = () => {
  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClint.get(GET_USER_INFO, { withCredentials: true })
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        }
        else {
          setUserInfo(undefined)

        }
        console.log(response)
      } catch (error) {
        setUserInfo(undefined)
      } finally{
        setLoading(false)
      }
    }
    if (!userInfo) {
      getUserData()
    }
    else {
      setLoading(false)
    }


  }, [userInfo, setUserInfo])
  if (loading) {
    return <div className="bg-[#1c1c25] w-[100vw] h-[100vh] flex justify-center items-center "><HashLoader color="#ffffff" /></div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={
          <AuthRoutes>
            <Auth />
          </AuthRoutes>
        } />
        <Route path='/chat' element={
          <PrivateRoutes>
            <Chat />
          </PrivateRoutes>
        } />
        <Route path='/profile' element={
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        } />
        <Route path='*' element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
