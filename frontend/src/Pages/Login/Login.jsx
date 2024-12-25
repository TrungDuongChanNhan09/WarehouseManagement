import React, { useState } from "react";
import './Login.css';
import Stack from '@mui/material/Stack'
import { Container, TextField, Checkbox, FormControlLabel, Typography, Button, Box, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/Logo.svg'
import ApiService from "../../Service/ApiService";  // Đảm bảo ApiService được import đúng

const Login = () => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/app/home';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ userName, password });

            // Kiểm tra xem response có chứa jwt và role không
            if (response.jwt) {
                localStorage.setItem('jwt', response.jwt);  // Lưu jwt vào localStorage
                localStorage.setItem('role', response.role);  // Lưu role vào localStorage
                navigate(from, { replace: true });  // Chuyển hướng về trang trước đó
            } else {
                throw new Error('Token không có trong phản hồi');
            }
        } catch (error) {
            // Đảm bảo thông báo lỗi chi tiết từ API
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <Container style={{ padding: 0 }} maxWidth="xl" className="login">
            <Stack className="body-login" direction="row" spacing={0} >
                <Stack className="background-page">
                    <img src="https://res.cloudinary.com/dsygvdfd2/image/upload/v1734527189/loginimage.png" />
                    <Typography className="background-title">
                        About us
                    </Typography>
                    <Typography className="background-content">
                        Our warehouse management team excels in efficiency, precision, and reliability. We are committed to delivering top-tier management practices that ensure seamless operations, from inventory tracking to order fulfillment. With a focus on optimizing space, minimizing errors, and streamlining processes, we consistently achieve fast and accurate deliveries.
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" maxWidth="100%" justifyContent="center" alignItems="center" className="information-page">
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
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        sx={{ width: "400px" }}
                        className="infor-email"
                        id="outlined-basic"
                        label="Tên đăng nhập"
                        variant="outlined"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        sx={{ width: "400px" }}
                        id="outlined-password-input"
                        className="infor-pass"
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Stack alignSelf="flex-start" direction="row" alignItems={"space-between"}>
                        <FormControlLabel control={<Checkbox style={{ color: "#F25D07" }} onChange={handleClickShowPassword} />} label="Hiện mật khẩu" />
                    </Stack>

                    <Button type="submit" variant="contained" className="button-login">
                        Đăng nhập
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
}

export default Login;
