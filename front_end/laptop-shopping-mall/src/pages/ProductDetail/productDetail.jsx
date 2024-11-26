import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { state } = useLocation();
  const productId = state?.product?.ProductID || ""; // 获取产品 ID
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      console.log("API Request URL:", `http://localhost:5005/api/products/${productId}`);

      const fetchProductDetail = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5005/api/products/${productId}` // 替换为具体 ID
          );
          if (response.data.success) {
            setProduct(response.data.product);
          }
        } catch (error) {
          console.error("Error fetching product details:", error.message);
        }
      };
  
      fetchProductDetail();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Loading product details...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Product not found.</Typography>
      </Box>
    );
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
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
            <CardMedia
              component="img"
              image={product.ProductImage || "https://via.placeholder.com/600x400"}
              alt={product.ProductName}
              sx={{ width: "100%", height: 400, objectFit: "cover" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4, borderRadius: 2, padding: 3 }}>
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
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#d32f2f", my: 2 }}
              >
                Price: ${product.ProductPrice}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: product.ProductStock > 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {product.ProductStock > 0 ? "In Stock" : "Out of Stock"}
              </Typography>
            </CardContent>

            <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
              <Button variant="contained" color="primary" fullWidth>
                Add to Cart
              </Button>
              <Button variant="contained" color="secondary" fullWidth>
                Buy Now
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
