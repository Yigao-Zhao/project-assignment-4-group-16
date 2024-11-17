import React from 'react';
import {
    Container,
    Box,
    Typography,
} from '@mui/material';

const UserDashboard = () => {
   
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
                    User Dashboard
                </Typography>
              
                  
            </Box>
        </Container>
    );
};

export default UserDashboard;