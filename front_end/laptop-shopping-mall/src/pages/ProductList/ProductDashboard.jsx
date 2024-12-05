/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Avatar, ListItemAvatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { fetchProducts } from '../../services/productService';
import { addItemToCart } from '../../services/cartService';
import { removeItemFromCart } from '../../services/cartService';
import { fetchCart } from '../../services/cartService'; 

//import Product from '../../../../../back_end/models/productModel';

const ProductDashboard = () => {
    const [cart, setCart] = useState([]); // Predefined cart items
    const [isCartOpen, setIsCartOpen] = useState(false); // Drawer open/close state
    const navigate = useNavigate();
    const { isAuthenticated, userId} = useAuth(); // AuthContext get log in status

    const [isLoading, setIsLoading] = useState(true); // load status
    const [products, setProducts] = useState([]); // product list

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]); // Example range: 0 to 1000
    const [maxPrice, setMaxPrice] = useState(2000); // Default max price (can be updated dynamically)

   // Extract unique types from products
   const uniqueTypes = Array.from(new Set(products.map((product) => product.ProductType)));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch products from the server
                const response = await axios.get('http://localhost:5005/api/product/products');
                setProducts(response.data.products); // set data
            } catch (error) {
                console.error('Failed to fetch data:', error.message);
            } finally {
                setIsLoading(false);
            }
        };
		const loadCart = async () => {
		        try {
		            const cartItems = await fetchCart(userId.UserId);
		            console.log('Fetched cart items:', cartItems);
		            setCart(Array.isArray(cartItems) ? cartItems : []); // make sure it is a data set
		        } catch (error) {
		            console.error('Failed to load cart:', error.message);
		            setCart([]); 
		        } finally {
		            setIsLoading(false);
		        }
		    };
		
		    if (isAuthenticated && userId) {
		        loadCart();
		    }

        fetchData();
    }, []);


     // Calculate dynamic max price
     useEffect(() => {
        if (products.length > 0) {
            const maxProductPrice = Math.max(...products.map((product) => product.ProductPrice));
            setMaxPrice(maxProductPrice); // Set max price dynamically based on the products
        }
    }, [products]); // Recalculate whenever products change

     // Handle filtering
     const filteredProducts = products
     .filter(
        (product) =>
            (product.ProductName && product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.ProductSpecifications && product.ProductSpecifications.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.ProductType && product.ProductType.toLowerCase().includes(searchQuery.toLowerCase()))
    )
     .filter((product) => {
         if (selectedTypes.length === 0) return true;
         return selectedTypes.includes(product.ProductType);
     })
     .filter((product) => {
         const [minPrice, maxPrice] = priceRange;
         return product.ProductPrice >= minPrice && product.ProductPrice <= maxPrice;
     });

 // Update selected product types
 const handleTypeChange = (type) => {
     setSelectedTypes((prevSelected) =>
         prevSelected.includes(type)
             ? prevSelected.filter((t) => t !== type)
             : [...prevSelected, type]
     );
 };

 // Update price range
 const handlePriceChange = (event, newValue) => setPriceRange(newValue);

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
    // Add to cart
    const handleAddToCart = async (product) => {
            if (!isAuthenticated) {
                console.log('User not logged in, redirecting to login page');
                navigate('/login'); 
                return;
            }
    
            try {
                const cartId = 101; 
                const quantity = 1;

                await addItemToCart(userId.userId, cartId, product.ProductID, quantity);
				const cartItems = await fetchCart(userId.userId);
				console.log('Fetched cart items:', cartItems);
				setCart(Array.isArray(cartItems) ? cartItems : []);
            } catch (error) {
                console.error('Failed to add product to cart:', error.message);
            }
        };

    // View details and navigate to ProductList page
    const handleViewDetails = (product) => {
        navigate('/ProductDetail', { state: { product } });
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

    if (isLoading) {
        return (
            <Container>
                <Typography variant="h5" align="center" sx={{ mt: 4 }}>
                    Loading products...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1">
                    Product List
                </Typography>
            </Box>

             {/* Search and Filters */}
             <Box sx={{ mb: 4 }}>
                {/* Search Bar */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search by name or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Type Filters */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Filter by Product Type
                </Typography>
                <FormGroup row>
                    {uniqueTypes.map((type) => (
                        <FormControlLabel
                            key={type}
                            control={
                                <Checkbox
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                />
                            }
                            label={type}
                        />
                    ))}
                </FormGroup>

                {/* Price Range Slider */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Filter by Price Range
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice} // Dynamically set max price based on products
                />
                <Typography>
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Typography>
            </Box>

            <Grid container direction="column" spacing={2}>
                {filteredProducts.map((product) => (
                    <Grid item key={`${product.ProductId}-${Math.random()}`} >
                        <Card sx={{ width: '100%' , display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                               height="300"
                               //objectFit= 'contain'
                                image={product.ProductImage}
                                alt={product?.ProductName}
                                sx={{
                                   objectFit: 'contain', 
                                   flexShrink: 0, 
                                }}
                            />
							
                        <CardContent>
                            <Typography variant="h6">{product.ProductName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.ProductSpecifications}
                            </Typography>
                            <Typography variant="subtitle1" color="primary">
                                ${product.ProductPrice}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {product.ProductStock !== 0 ? (
                                <>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewDetails(product)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                </>
                            ) : <h3> NO STOCK</h3>}
                        </CardActions>
                    </Card>
                    </Grid>
                ))}
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
        </Container >
    );
};

export default ProductDashboard;