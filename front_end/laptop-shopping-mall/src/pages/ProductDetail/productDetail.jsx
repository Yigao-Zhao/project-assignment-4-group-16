/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  IconButton,
  TextField,
  Slider,
  FormControlLabel,
  FormGroup,
  
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../../services/cartService';
import { fetchCart } from '../../services/cartService'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Avatar, ListItemAvatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { removeItemFromCart } from '../../services/cartService';

const ProductDetail = () => {
	
	const { isAuthenticated, userId} = useAuth();
	const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product; // from route take product data
  const [reviews, setReviews] = useState([
  
    { rating: 5, text: "Excellent product!" },
    { rating: 4, text: "Very good, but a bit pricey." },
  ]);
  const [newReview, setNewReview] = useState(""); 
  const [rating, setRating] = useState(0); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 
  const [cart, setCart] = useState([]); // Predefined cart items
  const [isCartOpen, setIsCartOpen] = useState(false); // Drawer open/close state
  const [isLoading, setIsLoading] = useState(true); // load status

// Toggle cart drawer
    const toggleCart = async (open) => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}
		const cartItems = await fetchCart(userId.userId);
		console.log('Fetched cart items:', cartItems);
		setCart(Array.isArray(cartItems) ? cartItems : []);
        setIsCartOpen(open);
    };
const handleCheckout = () => {
	    if (!isAuthenticated) {
	        navigate('/login');
	        return;
	    }
	
	    // selected product
	    const selectedItems = cart.filter((item) => item.checked);
	
	    if (selectedItems.length === 0) {
	        // notification
	        alert('no item have been selected');
	        return;
	    }

	    console.log('Selected Cart Items:', selectedItems);
	
	   
	    navigate('/payment', { state: { selectedItems } });
	};
const handleremoveChange = async (product) => {
        if (!isAuthenticated) {
            console.log('User not logged in, redirecting to login page');
            navigate('/login'); //navigate when not log in
            return;
        }
            
        try {
            const cartId = 101; 
            const quantity = 1;
        
            await removeItemFromCart(userId.userId, cartId, product.ProductID);
        	const cartItems = await fetchCart(userId.userId);
        	console.log('Fetched cart items:', cartItems);
        	setCart(Array.isArray(cartItems) ? cartItems : []);
        } catch (error) {
            console.error('Failed to add product to cart:', error.message);
        }
    };
	const handleAddToCart = async (product) => {
		if (!isAuthenticated) {
			console.log('User not logged in, redirecting to login page');
			navigate('/login'); // if dont log in ,navigate
			return;
		}

		try {
			const cartId = 101; 
			const quantity = 1;
			await addItemToCart(userId.userId, cartId, product.ProductID, quantity);
		} catch (error) {
			console.error('Failed to add product to cart:', error.message);
		}
	};
  
  
  const handleSubmitReview = () => {
    if (!rating || !newReview) {
      setSnackbarMessage("Please provide both rating and review.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setReviews((prev) => [...prev, { rating, text: newReview }]);
    setNewReview("");
    setRating(0);
    setSnackbarMessage("Review added successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };
  useEffect(() => {
  	const loadCart = async () => {
  	        try {
				
  	            const cartItems = await fetchCart(userId.UserId);
  	            console.log('Fetched cart items:', cartItems);
  	            setCart(Array.isArray(cartItems) ? cartItems : []); // make sure it is a data set
				console.log(cartItems)
  	        } catch (error) {
  	            console.error('Failed to load cart:', error.message);
  	            setCart([]); 
  	        } finally {
				setIsLoading(false);
  	        }
  	    };
  	// eslint-disable-next-line
  	    if (isAuthenticated && userId) {
  	        loadCart();
  	    }
  }, []);

  if (!product) {
 
    return <Typography>Product details are not available.</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* pic */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4, borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              component="img"
              image={product.ProductImage}
              alt={product.ProductName}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
              }}
            />
          </Card>
        </Grid>

        {/* detail */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 4,
              borderRadius: 2,
              padding: 3,
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                {product.ProductName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Product ID:</strong> {product.ProductID}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Product Type:</strong> {product.ProductType}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Specifications:</strong> {product.ProductSpecifications}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#d32f2f", my: 2 }}>
                Price: ${product.ProductPrice}
              </Typography>
              <Typography variant="body1" sx={{ color: "green", fontWeight: "bold" }}>
                Stock: {product.ProductStock || "In Stock"}
              </Typography>
			  <Button
			      size="small"
			      variant="outlined"
			      color="secondary"
			      onClick={() => handleAddToCart(product)}
			  >
			      Add to Cart
			  </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
	{/* Floating Cart Button */ }
	<Fab
	    color="primary"
	    aria-label="cart"
	    sx={{ position: 'fixed', bottom: 16, right: 16 }}
	    onClick={() => toggleCart(true)}
	>
	    <ShoppingCartIcon />
	</Fab>
	
	{/* Cart Drawer */ }
	<Drawer anchor="right" open={isCartOpen} onClose={() => toggleCart(false)}>
	    <Box sx={{ width: 300, p: 2 }}>
	        <Typography variant="h6" component="h2" gutterBottom>
	            Shopping Cart
	        </Typography>
	        <Divider />
	        {isLoading ? (
	            <Typography sx={{ mt: 2 }} align="center">
	                Loading...
	            </Typography>
	        ) : cart.length === 0 ? (
	            <Typography sx={{ mt: 2 }} align="center">
	                Your cart is empty.
	            </Typography>
	        ) : (
	            <List>
	                {cart.map((item) => (
	                    <ListItem
	                        key={`${item.CartItemID}-${Math.random()}`}
	                        secondaryAction={
	                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
	                                <IconButton
	                                    edge="end"
	                                    onClick={() => handleremoveChange(item)}
	                                >
	                                    <RemoveIcon />
	                                </IconButton>
	                                <Typography
	                                    variant="body1"
	                                    sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}
	                                >
	                                    {item.Quantity}
	                                </Typography>
	                                <IconButton
	                                    edge="end"
	                                    onClick={() => handleAddToCart(item)}
	                                >
	                                    <AddIcon />
	                                </IconButton>
	                            </Box>
	                        }
	                    >
	                        <ListItemAvatar>
	                            <Avatar
	                                src={item.ProductImage}
	                                alt={item.ProductName}
	                                sx={{ width: 56, height: 56 }}
	                            />
								
	                        </ListItemAvatar>
	                        <Checkbox
	                            checked={item.checked || false}
	                            onChange={() => {
	                                setCart((prevCart) =>
	                                    prevCart.map((cartItem) =>
	                                        cartItem.CartItemID === item.CartItemID
	                                            ? { ...cartItem, checked: !cartItem.checked }
	                                            : cartItem
	                                    )
	                                );
	                            }}
	                        />
	                        <ListItemText
	                            primary={item.ProductName}
	                            secondary={`Price: $${item.ProductPrice.toFixed(2)}`}
	                        />
	                    </ListItem>
	                ))}
	            </List>
	        )}
	        <Divider sx={{ my: 2 }} />
	
	        {/* total calculate */}
	        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
	            <Typography variant="subtitle1">Total:</Typography>
	            <Typography variant="subtitle1">
	                $
	                {cart
	                    .filter((item) => item.checked) 
	                    .reduce((total, item) => total + item.ProductPrice * item.Quantity, 0) 
	                    .toFixed(2)}
	            </Typography>
	        </Box>
	
	        <Button
	            variant="contained"
	            color="success"
	            fullWidth
	            onClick={handleCheckout}
	            disabled={cart.length === 0}
	        >
	            Checkout
	        </Button>
	    </Box>
	</Drawer>
      
    </Box>
  );
};

export default ProductDetail;
