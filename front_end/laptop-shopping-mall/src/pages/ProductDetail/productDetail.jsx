import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

const ProductDetail = () => {
  // Example product data
  const product = {
    ProductID: "12345",
    ProductName: "Wireless Headphones",
    ProductType: "Electronics",
    ProductSpecifications:
      "Bluetooth 5.0, Noise Cancelling, 20 Hours Battery Life",
    ProductImage: "https://via.placeholder.com/600x400", // Replace with actual image URL
    ProductPrice: "$199.99",
    ProductStock: "In Stock",
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: 4,
      }}
    >
      {/* Product Page Layout */}
      <Grid container spacing={4} justifyContent="center">
        {/* Product Image Section */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 4,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
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

        {/* Product Details Section */}
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
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                }}
              >
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
                sx={{
                  fontWeight: "bold",
                  color: "#d32f2f",
                  my: 2,
                }}
              >
                Price: {product.ProductPrice}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: product.ProductStock === "In Stock" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {product.ProductStock}
              </Typography>
            </CardContent>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 2,
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 1.5,
                  backgroundColor: "#1976d2",
                  ":hover": { backgroundColor: "#125ea0" },
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 1.5,
                }}
              >
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
