import React, { useState } from 'react';
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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 引入 AuthContext

const ProductDashboard = () => {
    const [cart, setCart] = useState([
        { id: 1, title: 'Laptop 1', price: 100, quantity: 1, checked: false },
        { id: 2, title: 'Laptop 2', price: 200, quantity: 2, checked: false },
    ]); // Predefined cart items
    const [isCartOpen, setIsCartOpen] = useState(false); // Drawer open/close state
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // 从 AuthContext 获取登录状态

    // Mock product list
    const products = [
        {
            id: 1,
            title: 'Laptop 1',
            description: 'Description of laptop 1',
            image: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Highlight-Surface-Laptop-Go-3-001-3000x1682:VP2-859x540',
            price: 100,
        },
        {
            id: 2,
            title: 'Laptop 2',
            description: 'Description of laptop 2',
            image: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Highlight-Surface-Laptop-Go-3-001-3000x1682:VP2-859x540',
            price: 200,
        },
        {
            id: 3,
            title: 'Laptop 3',
            description: 'Description of laptop 3',
            image: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Highlight-Surface-Laptop-Go-3-001-3000x1682:VP2-859x540',
            price: 300,
        },
    ];

    // Add to cart
    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            console.log('User not logged in, redirecting to login page');
            navigate('/login'); // Redirect to login page if not logged in
        } else {
            console.log('User logged in, adding product to cart:', product);
            // 写加入购物车的逻辑
        }
    };

    // View details and navigate to ProductList page
    const handleViewDetails = (product) => {
        navigate('/ProductDetail', { state: { product } });
    };

    // Toggle cart drawer
    const toggleCart = (open) => {
        setIsCartOpen(open);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1">
                    Product List
                </Typography>
            </Box>
            <Grid container direction="column" spacing={2}>
                {products.map((product) => (
                    <Grid item key={product.id}>
                        <Card sx={{ width: '100%' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image}
                                alt={product.title}
                            />
                            <CardContent>
                                <Typography variant="h6">{product.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                    ${product.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
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
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Floating Cart Button */}
            <Fab
                color="primary"
                aria-label="cart"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => toggleCart(true)}
            >
                <ShoppingCartIcon />
            </Fab>

            {/* Cart Drawer */}
            <Drawer anchor="right" open={isCartOpen} onClose={() => toggleCart(false)}>
                <Box sx={{ width: 300, p: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Shopping Cart
                    </Typography>
                    <Divider />
                    <List>
                        {cart.map((item) => (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setCart((prevCart) =>
                                                    prevCart.map((cartItem) =>
                                                        cartItem.id === item.id && cartItem.quantity > 1
                                                            ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                                            : cartItem
                                                    )
                                                )
                                            }
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography
                                            variant="body1"
                                            sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setCart((prevCart) =>
                                                    prevCart.map((cartItem) =>
                                                        cartItem.id === item.id
                                                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                                            : cartItem
                                                    )
                                                )
                                            }
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <Checkbox
                                    checked={item.checked}
                                    onChange={() => {
                                        setCart((prevCart) =>
                                            prevCart.map((cartItem) =>
                                                cartItem.id === item.id
                                                    ? { ...cartItem, checked: !cartItem.checked }
                                                    : cartItem
                                            )
                                        );
                                    }}
                                />
                                <ListItemText
                                    primary={item.title}
                                    secondary={`Price: $${item.price}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate('/login');
                            } else {
                                navigate('/payment');
                            }
                        }}
                    >
                        Checkout
                    </Button>
                </Box>
            </Drawer>
        </Container>
    );
};

export default ProductDashboard;