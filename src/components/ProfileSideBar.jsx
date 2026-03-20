import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import IconButton from './IconButton'
import { useTheme } from './ThemeContext'

export default function ProfileSideBar() {
  const {isDark} = useTheme()
  const menuItems = [
     { icon: 'bi-house-door', text: 'Home', active: false },
        { icon: 'bi-search', text: 'Explore', active: false },
        { icon: 'bi-bell', text: 'Notifications', active: false },
        { icon: 'bi-envelope', text: 'Messages', active: false },
        { icon: 'bi-bookmark', text: 'Bookmarks', active: false },
        { icon: 'bi-person', text: 'Profile', active: true },  // Active on profile
        { icon: 'bi-three-dots', text: 'More', active: false },
  ]
  return (
    <div className={`profile-sidebar ${isDark ? 'dark' : ''}`}>
      <Nav className='flex-column'>
        {menuItems.map((item,index) => (
          <Nav.Link key={index} href='#' className='mb-1'>
            <IconButton icon={item.icon} text={item.text} isActive={item.active}/>
          </Nav.Link>
        ))}
      </Nav>
      <Button className='tweet-btn w-100 mt-3 rounded-pill py-3'>
        <i className='bi bi-feather me-2'></i>
        <span className='d-none d-md-inline'>Tweet</span>
      </Button>
    </div>
  )
}
