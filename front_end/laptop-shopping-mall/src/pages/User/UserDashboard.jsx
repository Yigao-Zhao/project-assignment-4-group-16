/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  Divider,
} from "@mui/material";
import { getUserInfo, updateUserInfo } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { fetchOrder } from "../../services/orderService";

const UserDashboard = () => {
  const [user, setUser] = useState({
    UserId: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Address: "",
    Email: "",
    MyPassword: "",
  });

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // For order details drawer
  const { userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [backupUser, setBackupUser] = useState({ ...user });
  const [uniqueOrders, setUniqueOrders] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getUserInfo(userId.userId);
      if (response && response.user && response.user.length > 0) {
        setUser(response.user[0]);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error.message);
    }
  };
const fetchOrders = async () => {
  try {
    const orderItems = await fetchOrder(userId.userId);
    if (Array.isArray(orderItems)) {
      // Group orders by OrderID and keep only the first order of each group
      const groupedOrders = orderItems.reduce((acc, order) => {
        if (!acc[order.OrderID]) {
          acc[order.OrderID] = [];
        }
        acc[order.OrderID].push(order);
        return acc;
      }, {});
      setUniqueOrders(Object.values(groupedOrders).map((group) => group[0]));
    } else {
      setOrders([]);
    }
    setOrders(orderItems);
  } catch (error) {
    console.error("Failed to fetch orders:", error.message);
  }
};

  useEffect(() => {
    fetchData();
    fetchOrders();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEdit = () => {
    setBackupUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUserInfo(user);
      alert("Profile saved successfully!");
      setIsEditing(false);
      await fetchData();
    } catch (error) {
      console.error("Error saving profile:", error.message);
      alert("An error occurred while saving the profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setUser(backupUser);
    setIsEditing(false);
  };

const handleOrderClick = (orderId) => {
  // 筛选出与点击的订单ID匹配的所有订单项
  const orderDetails = orders.filter((order) => order.OrderID === orderId);
  // 设置选中的订单详情
  setSelectedOrder(orderDetails);
  // 打开抽屉显示订单详情
  setIsDrawerOpen(true);
};

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  };

  const fieldLabels = {
    FirstName: "First Name",
    MiddleName: "Middle Name",
    LastName: "Last Name",
    Address: "Address",
    Email: "Email Address",
    MyPassword: "Password",
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
              {Object.keys(user)
                .filter((key) => key in fieldLabels)
                .map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      label={fieldLabels[key]}
                      name={key}
                      value={user[key] || "N/A"}
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
                    sx={{
                      textTransform: "none",
                      fontSize: "1rem",
                      borderRadius: 50,
                      px: 4,
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{
                      textTransform: "none",
                      fontSize: "1rem",
                      borderRadius: 50,
                      px: 4,
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    borderRadius: 50,
                    px: 4,
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Orders
        </Typography>
        <List>
          {uniqueOrders.map((order) => (
            <ListItem
              button="true"
              key={order.OrderID}
              onClick={() => handleOrderClick(order.OrderID)}
            >
              <ListItemText
                primary={`Order ID: ${order.OrderID}`}
                secondary={`Total: $${order.Total?.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Order Details Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedOrder && (
            <>
              {/* Displaying order summary */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Order ID:</strong> {selectedOrder[0].OrderID}
                </Typography>
           
                <Typography variant="body1">
                  <strong>Status:</strong> {selectedOrder[0].OrderStatus || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Total:</strong> $
                  {selectedOrder
                    .reduce(
                      (acc, item) =>
                        acc + item.OrderProductQuantity * item.OrderProductSoldPrice,
                      0
                    )
                    .toFixed(2)}
                </Typography>
              </Box>
      
              {/* Displaying order items */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.map((item) => (
                      <TableRow key={item.OrderItemID}>
                        <TableCell>{item.ProductName}</TableCell>
                        <TableCell>{item.OrderProductQuantity}</TableCell>
                        <TableCell>${item.OrderProductSoldPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          $
                          {(
                            item.OrderProductQuantity * item.OrderProductSoldPrice
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          <Button
            onClick={handleDrawerClose}
            variant="contained"
            sx={{ mt: 2, textTransform: "none" }}
          >
            Close
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default UserDashboard;