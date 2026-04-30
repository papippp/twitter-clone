// ProfileSideBar.jsx - Complete replacement

import React, { useState, useEffect } from 'react'
import { Nav } from 'react-bootstrap'

import { useTheme } from './ThemeContext'

export default function ProfileSideBar() {
  const { isDark } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const menuItems = [
    { icon: 'bi-house-door', text: 'Home', active: false },
    { icon: 'bi-search', text: 'Explore', active: false },
    { icon: 'bi-bell', text: 'Notifications', active: false },
    { icon: 'bi-envelope', text: 'Messages', active: false },
    { icon: 'bi-bookmark', text: 'Bookmarks', active: false },
    { icon: 'bi-person', text: 'Profile', active: true },
    { icon: 'bi-three-dots', text: 'More', active: false },
  ]
  
  return (
    <div className={`profile-sidebar ${isDark ? 'dark' : ''}`}>
      <Nav className={`flex-${isMobile ? 'row' : 'column'} justify-content-around`}>
        {menuItems.map((item, index) => (
          <Nav.Link key={index} href='#' className='mb-0 mb-md-1 p-0'>
           
          </Nav.Link>
        ))}
      </Nav>
    </div>
  )
}