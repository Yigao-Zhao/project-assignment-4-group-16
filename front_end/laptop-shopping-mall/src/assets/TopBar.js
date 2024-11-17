import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const TopBar = () => {
    console.log('TopBar is rendering');
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth(); 
    const userName = "John Doe"; 

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                <Button
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)} 
                >
                    Back
                </Button>

                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Computer Shop
                </Typography>

                <Box>
                    {!isAuthenticated ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/user')}
                                sx={{ textTransform: 'none', marginRight: '16px' }} 
                            >
                                {userName}
                            </Button>

                            <Button color="inherit" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;