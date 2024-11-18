import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const UserDashboard = () => {
  const [user, setUser] = useState({
    UserID: 1,
    FirstName: "John",
    MiddleName: "Doe",
    LastName: "Smith",
    Address: "123 Main St",
    Email: "john@example.com",
    PaymentMethod: "Credit Card",
    IsAdmin: "N",
    MyPassword: "password123",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [backupUser, setBackupUser] = useState({ ...user });
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderHistory = [
    { id: "12345", date: "2024-11-01", product: "Laptop", progress: "Delivered" },
    { id: "67890", date: "2024-11-05", product: "Headphones", progress: "Shipped" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEdit = () => {
    setBackupUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile saved!");
  };

  const handleCancel = () => {
    setUser(backupUser);
    setIsEditing(false);
  };

  const toggleOrderHistory = () => {
    setShowOrderHistory(!showOrderHistory);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Set the selected order to show in the dialog
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null); // Clear the selected order and close the dialog
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* User Profile Section */}
      <Card
        sx={{
          mt: 5,
          p: 3,
          background: "linear-gradient(to right, #f7f9fc, #e8eff7)",
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "#1976d2",
              textAlign: "center",
              textShadow: "1px 1px 2px #888",
            }}
          >
            User Profile
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={3}>
              {Object.keys(user).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key}
                    name={key}
                    value={user[key]}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                    sx={{
                      backgroundColor: isEditing ? "#fff" : "#f1f1f1",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ textTransform: "none", fontSize: "1rem", borderRadius: 50, px: 4 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{ textTransform: "none", fontSize: "1rem", borderRadius: 50, px: 4 }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{ textTransform: "none", fontSize: "1rem", borderRadius: 50, px: 4 }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Order History Section */}
      <Box sx={{ mt: 5 }}>
        <Button
          variant="contained"
          onClick={toggleOrderHistory}
          sx={{
            mb: 2,
            textTransform: "none",
            fontSize: "1rem",
            borderRadius: 50,
            backgroundColor: "#1976d2",
            ":hover": { backgroundColor: "#125ea0" },
            px: 4,
          }}
        >
          {showOrderHistory ? "Hide My History" : "View My Order History"}
        </Button>
        {showOrderHistory && (
          <Card sx={{ p: 2, backgroundColor: "#ffffff", boxShadow: 4, borderRadius: 3 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => handleOrderClick(order)} // Open dialog on click
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                        transition: "background-color 0.3s",
                      }}
                    >
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <strong>Product:</strong> {selectedOrder.product}
            </Typography>
            <Typography variant="body1">
              <strong>Progress:</strong> {selectedOrder.progress}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default UserDashboard;


