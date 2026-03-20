import React from 'react'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './components/AuthProvider'
import { ThemeProvider } from './components/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <BrowserRouter>
     <Routes>
      <Route element={<AuthPage/>} path='/'/>
      <Route element={<ProfilePage/>} path='/profile'/>
     </Routes>
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
    
  )
}
