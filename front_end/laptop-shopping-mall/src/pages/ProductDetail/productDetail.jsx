import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; // 引入 AuthContext
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../../services/cartService';
const ProductDetail = () => {
	const { isAuthenticated, userId} = useAuth();
	const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product; // 从路由状态中接收产品数据
  const [reviews, setReviews] = useState([
    // 静态 DEMO 评论数据
    { rating: 5, text: "Excellent product!" },
    { rating: 4, text: "Very good, but a bit pricey." },
  ]);
  const [newReview, setNewReview] = useState(""); // 用户输入的新评论
  const [rating, setRating] = useState(0); // 用户输入的新评分
  const [openSnackbar, setOpenSnackbar] = useState(false); // 控制提示框
  const [snackbarMessage, setSnackbarMessage] = useState(""); // 提示消息
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 提示类型

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
		} catch (error) {
			console.error('Failed to add product to cart:', error.message);
		}
	};
  // 提交评论
  
  const handleSubmitReview = () => {
    if (!rating || !newReview) {
      setSnackbarMessage("Please provide both rating and review.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // 模拟新增评论（静态数据）
    setReviews((prev) => [...prev, { rating, text: newReview }]);
    setNewReview("");
    setRating(0);
    setSnackbarMessage("Review added successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  if (!product) {
    // 如果没有产品数据，提示用户
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
        {/* 产品图片 */}
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

        {/* 产品详情 */}
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

      {/* 评论部分 */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Reviews
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Card key={index} sx={{ mb: 2, p: 2 }}>
              <Typography>
                <strong>Rating:</strong> {review.rating} / 5
              </Typography>
              <Typography>{review.text}</Typography>
            </Card>
          ))
        ) : (
          <Typography>No reviews yet.</Typography>
        )}

        {/* 提交评论 */}
        <Card sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Add Your Review
          </Typography>
          <TextField
            label="Your Review"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Rating (1-5)"
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 1, max: 5 }}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Card>
      </Box>

      {/* 提示框 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;
