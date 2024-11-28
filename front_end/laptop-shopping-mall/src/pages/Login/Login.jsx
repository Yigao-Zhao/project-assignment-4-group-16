import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import { login as loginService } from '../../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginService(email, password);
            localStorage.setItem('token', data.token);
            login({
            userId: data.user.id,
        }	);

            if (data.user.isAdmin === 'Y') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 3, width: '100%' }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between', // 按钮两端对齐
                            mt: 2,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ flex: 1, mr: 1 }} // 两个按钮等宽，右侧留间距
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={() => navigate('/Registration')}
                            variant="outlined"
                            color="secondary"
                            sx={{ flex: 1 }} // 两个按钮等宽
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;