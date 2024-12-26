import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Grid2, Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import './header.css'
import Logo from '../../assets/Logo.svg'

export default function Header() {
  return (
    <>
        <AppBar
            className='AppBar'
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            >
            <Toolbar
                sx={{display: 'flex', justifyContent: 'space-between'}}
            >
                <Typography className='title_AppBar' variant="h6">Warehouse Management</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Hi, Admin
                    </Typography>
                    <Avatar alt="Admin" src="/static/images/avatar/1.jpg" sx={{ ml: 1 }} />
                </Box>
            </Toolbar>
        </AppBar>
    </>
  )
}