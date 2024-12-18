import React, { cloneElement } from "react";
import './Login.css';
import Stack from '@mui/material/Stack'
import { Container, TextField, Checkbox, FormControlLabel, Typography, Button} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'
const Login = () => {
    return(
        <Container maxWidth="xl" className="login">
            <Stack className="body-login" direction="row" spacing={2} >
                <Stack className="background-page">
                    <img src="https://res.cloudinary.com/dozs7ggs4/image/upload/v1734445440/65fa9266ad67d4612ab84a9a_mWDNJVWHuNpKHlZwTTm4wAMPTVGHo1bdZR6hUmqOuQ9UEhoE-out-0_m65j3s.png"/>
                </Stack>
                {/* justifyContent="space-between" */}
                <Stack className="information-page">
                    <Stack className="title" alignItems={"center"}>
                        <img src="https://res.cloudinary.com/dozs7ggs4/image/upload/v1734362317/WarehouseManagement-3_kibnmb.png"/>
                        <Typography 
                            className="title-login" 
                            variant="h5" 
                            sx={{ color: "#495E57" }} 
                            fontWeight={"bold"}>
                            Đăng nhập
                        </Typography>
                    </Stack>
                    
                    <TextField 
                        className="infor-email" 
                        id="outlined-basic" 
                        label="Email" 
                        variant="outlined">

                    </TextField>
                    <TextField
                        id="outlined-password-input"
                        className="infor-pass"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        />

                    <Stack direction="row" alignItems={"space-between"} >
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Hiện mật khẩu" />
                    </Stack>

                    <Stack direction="column" alignItems={"center"}>
                        <Button variant="contained" className="button-login">
                            <Link className='link' to='/app/home'> Đăng nhập</Link>
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    )
}
export default Login


