import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    List,
    ListItem,
    Alert,
} from '@mui/material';
import { fetchUsers } from '../../services/userService';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const handleFetchUsers = async () => {
        setError('');
        try {
            const userList = await fetchUsers();
            setUsers(userList);
        } catch (err) {
            setError(err.message);
        }
    };

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
                    Admin Dashboard
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFetchUsers}
                    sx={{ mb: 3 }}
                >
                    Fetch Users
                </Button>
                {users.length > 0 && (
                    <List>
                        {users.map((user) => (
                            <ListItem key={user.UserID}>
                                {user.FirstName} {user.LastName} - {user.Email}
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Container>
    );
};

export default AdminDashboard;