import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography ,Toolbar} from '@mui/material';

const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('User Management');

    const NAVIGATION = [
        { id: 'user-management', label: 'User Management' },
        { id: 'product-management', label: 'Product Management' },
    ];

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
		<Drawer
		    variant="permanent"
		    sx={{
		        width: 240,
		        flexShrink: 0,
		        [`& .MuiDrawer-paper`]: {
		            width: 240,
		            boxSizing: 'border-box',
					zIndex: (theme) => theme.zIndex.appBar - 1
		        },
		    }}
		>
		<Toolbar/>
		    <List>
		        {NAVIGATION.map((item) => (
		            <ListItem
		                button="true" 
		                key={item.id}
		                onClick={() => setSelectedSection(item.label)}
		                selected={selectedSection === item.label}
		            >
		                <ListItemText primary={item.label} />
		            </ListItem>
		        ))}
		    </List>
		</Drawer>
			

            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {selectedSection}
                </Typography>
                {selectedSection === 'User Management' && (
                    <Typography>
                        Manage users here. Add, edit, or delete user accounts.
                    </Typography>
                )}
                {selectedSection === 'Product Management' && (
                    <Typography>
                        Manage products here. Add, edit, or delete product listings.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default AdminDashboard;