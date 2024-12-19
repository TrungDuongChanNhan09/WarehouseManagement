import React, { cloneElement } from "react";
import './Login.css';
import Stack from '@mui/material/Stack'
import { Container, TextField, Checkbox, FormControlLabel, Typography, Button, colors} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'
import Logo from '../../assets/Logo.svg'

const Login = () => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    return(
        <Container style={{padding: 0}} maxWidth="xl" className="login">
            <Stack className="body-login" direction="row" spacing={0} >
                <Stack className="background-page">
                    <img src="https://res.cloudinary.com/dsygvdfd2/image/upload/v1734536548/loginimage.png"/>
                    <Typography className="background-title">
                        About us
                    </Typography>
                    <Typography className="background-content">
                        Our warehouse management team excels in efficiency, precision, and reliability. We are committed to delivering top-tier management practices that ensure seamless operations, from inventory tracking to order fulfillment. With a focus on optimizing space, minimizing errors, and streamlining processes, we consistently achieve fast and accurate deliveries.
                    </Typography>
                </Stack>
                {/* justifyContent="space-between" */}
                <Stack justifyContent="center" className="information-page">
                    <Stack className="title" alignItems={"center"}>
                        <img src={Logo}/>
                        <Typography 
                            className="title-login" 
                            variant="h4" 
                            sx={{ color: "#F25D07" }} 
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
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        />

                    <Stack direction="row" alignItems={"space-between"} >
                        <FormControlLabel control={<Checkbox style ={{color: "#F25D07",}} onClick={handleClickShowPassword}/>} label="Hiện mật khẩu" />
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


