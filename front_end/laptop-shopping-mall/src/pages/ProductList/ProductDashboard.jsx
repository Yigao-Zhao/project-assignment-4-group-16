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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Avatar, ListItemAvatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 引入 AuthContext
import { fetchProducts } from '../../services/productService';
import { addItemToCart } from '../../services/cartService';
import { removeItemFromCart } from '../../services/cartService';
import { fetchCart } from '../../services/cartService'; 

//import Product from '../../../../../back_end/models/productModel';

const ProductDashboard = () => {
    const [cart, setCart] = useState([]); // Predefined cart items
    const [isCartOpen, setIsCartOpen] = useState(false); // Drawer open/close state
    const navigate = useNavigate();
    const { isAuthenticated, userId} = useAuth(); // 从 AuthContext 获取登录状态

    const [isLoading, setIsLoading] = useState(true); // 加载状态
    const [products, setProducts] = useState([]); // 产品列表

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch products from the server
                const response = await axios.get('http://localhost:5005/api/product/products');
                setProducts(response.data.products); // 设置产品数据
            } catch (error) {
                console.error('Failed to fetch data:', error.message);
            } finally {
                setIsLoading(false);
            }
        };
		const loadCart = async () => {
		        try {
		            const cartItems = await fetchCart(userId.userId);
		            console.log('Fetched cart items:', cartItems);
		            setCart(Array.isArray(cartItems) ? cartItems : []); // 确保 cartItems 是数组
		        } catch (error) {
		            console.error('Failed to load cart:', error.message);
		            setCart([]); // 遇到错误时设置为空数组
		        } finally {
		            setIsLoading(false);
		        }
		    };
		
		    if (isAuthenticated && userId) {
		        loadCart();
		    }

        fetchData();
    }, []);

const handleremoveChange = async (product) => {
        if (!isAuthenticated) {
            console.log('User not logged in, redirecting to login page');
            navigate('/login'); // 未登录时跳转到登录页面
            return;
        }
            
        try {
            const cartId = 101; // 示例值，根据实际需求动态设置
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
                navigate('/login'); // 未登录时跳转到登录页面
                return;
            }
    
            try {
                const cartId = 101; // 示例值，根据实际需求动态设置
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

		// 筛选选中的商品并提取 CartItemID
		const selectedItems = cart
			.filter((item) => item.checked) // 筛选选中的商品
			.map((item) => item); // 提取 CartItemID

		// 在控制台打印选中的商品 ID
		console.log('Selected CartItemIDs for :', selectedItems);

		// 导航到支付页面（可传递选中商品数据）
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
            <Grid container direction="column" spacing={2}>
                {products.map((product) => (
                    <Grid item key={product.ProductId}>
                        <Card sx={{ width: '100%' , display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                               height="300"
                               //objectFit= 'contain'// 保持图片比例，适应容器大小
                                image={product.ProductImage}
                                alt={product?.ProductName}
                                sx={{
                                   objectFit: 'contain', // 保持图片比例，适应容器大小
                                   flexShrink: 0, // 防止图片被压缩
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
                            key={item.CartItemID}
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
    
            {/* 总价格计算 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1">
                    $
                    {cart
                        .filter((item) => item.checked) // 筛选选中的商品
                        .reduce((total, item) => total + item.ProductPrice * item.Quantity, 0) // 计算总价
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