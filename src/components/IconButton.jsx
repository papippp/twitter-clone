import React from 'react'
import { Button } from 'react-bootstrap'
import { useTheme } from './ThemeContext'

export default function IconButton({icon, isActive= false,onClick,text}) {
  const {isDark} = useTheme() 
  
    return (
    <Button variant='link' onClick={onClick}
    style={{textDecoration : 'none', color: isActive ? '#1da1f2' : (isDark ? '#fff' : '#000'), border: 'none', borderRadius: '9999px'}}
     className={`icon-button d-flex align-items-center p-3 w-100 ${isActive ? 'active' : ''} ${isDark ? 'dark' : ''}`}
    >
        <i
        className={`bi ${icon} ${text ? 'me-3' : ''}`}
        style={{fontSize : '24px'}}
        ></i>
        {text && <span className='d-none d-md-inline fw-bold'>{text}</span>}

    </Button>
  )
}
