import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Address: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    PaymentMethod: "",
    IsAdmin: "N",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      PaymentMethod: e.target.value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateUser = (user) => {
    const errors = {};

    if (!user.FirstName) errors.FirstName = "First name is required.";
    if (!user.LastName) errors.LastName = "Last name is required.";
    if (!user.Address) errors.Address = "Address is required.";
    if (!user.Email) {
      errors.Email = "Email is required.";
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(user.Email)) {
        errors.Email = "Invalid email format.";
      }
    }
    if (!user.PaymentMethod) errors.PaymentMethod = "Payment method is required.";
    if (user.Password !== user.ConfirmPassword) {
      errors.ConfirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateUser(formData);
    if (Object.keys(validationError).length > 0) {
      setError(validationError);
      setSnackbarMessage("Please correct the errors.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      // 模拟提交
      setSnackbarMessage("User registered successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // 延时后返回主页
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error registering user:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { name: "FirstName", label: "First Name", required: true },
              { name: "MiddleName", label: "Middle Name" },
              { name: "LastName", label: "Last Name", required: true },
              { name: "Address", label: "Address", required: true },
              { name: "Email", label: "Email", type: "email", required: true },
            ].map(({ name, label, type = "text", required }) => (
              <Grid item xs={12} key={name}>
                <FormControl fullWidth error={Boolean(error[name])}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    required={required}
                  />
                  {error[name] && <FormHelperText>{error[name]}</FormHelperText>}
                </FormControl>
              </Grid>
            ))}
            {/* 下拉菜单 */}
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(error.PaymentMethod)}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.PaymentMethod}
                  onChange={handleSelectChange}
                  name="PaymentMethod"
                  required
                >
                  <MenuItem value="CreditCard">Credit Card</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                  <MenuItem value="BankTransfer">Bank Transfer</MenuItem>
                </Select>
                {error.PaymentMethod && (
                  <FormHelperText>{error.PaymentMethod}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {["Password", "ConfirmPassword"].map((field) => (
              <Grid item xs={12} key={field}>
                <FormControl fullWidth error={Boolean(error[field])}>
                  <TextField
                    fullWidth
                    label={field.replace("Confirm", "Confirm ")}
                    name={field}
                    type={showPassword ? "text" : "password"}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {error[field] && <FormHelperText>{error[field]}</FormHelperText>}
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default RegisterPage;