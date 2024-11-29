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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function RegisterPage() {
    const [formData, setFormData] = useState({
        FirstName: "",
        MiddleName: "",
        LastName: "",
        Address: "",
        Email: "",
        MyPassword: "",
        ConfirmPassword: "",
        PaymentMethod: "",
        IsAdmin: "N",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [dialogOpen, setDialogOpen] = useState(false);  // 控制弹窗显示
    const [dialogMessage, setDialogMessage] = useState("");  // 弹窗消息
    const [dialogSeverity, setDialogSeverity] = useState("success"); // 弹窗的类型（成功或错误）

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
        // 只在 ConfirmPassword 不为空且与 MyPassword 不一致时才添加错误信息
        if (user.MyPassword !== user.ConfirmPassword && user.ConfirmPassword !== "") {
            errors.ConfirmPassword = "Passwords do not match.";
        }


        return errors;
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`http://localhost:5005/api/user/check-email?email=${email}`);
            return response.data.exists;  // 如果邮箱存在，则返回 true
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateUser(formData);
        // 输出 formData 和 validationError，检查实际的密码值
        console.log("Form Data:", formData);
        console.log("Validation Errors:", validationError);
        if (Object.keys(validationError).length > 0) {
            setError(validationError);
            setSnackbarMessage("Please correct the errors.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        const { ConfirmPassword, ...submitData } = formData;

        // 检查邮箱是否唯一，只在邮箱被修改时执行

        const emailExists = await checkEmailExists(submitData.Email);
        if (emailExists) {
            setSnackbarMessage('Email already exists.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        try {
			submitData.MyPassword = CryptoJS.SHA256(submitData.MyPassword).toString();

            const response = await axios.post("http://localhost:5005/api/user/users", submitData);
            if (response.data.success) {
                // 注册成功时只显示 Dialog
                setDialogMessage("User registered successfully!");
                setDialogSeverity("success");
                setDialogOpen(true);

                setTimeout(() => {
                    navigate("/login");
                }, 3000);

                setFormData({
                    FirstName: "",
                    MiddleName: "",
                    LastName: "",
                    Address: "",
                    Email: "",
                    MyPassword: "",
                    ConfirmPassword: "",
                    PaymentMethod: "",
                    IsAdmin: "N",
                });

            } else {
                throw new Error(response.data.message || "Failed to add user.");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            setSnackbarMessage("Failed to add user.");
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
                        {["MyPassword", "ConfirmPassword"].map((field) => (
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

            {/* Dialog for successful registration */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{dialogSeverity === "success" ? "Success" : "Error"}</DialogTitle>
                <DialogContent>
                    <Alert severity={dialogSeverity} sx={{ width: "100%" }}>
                        {dialogMessage}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default RegisterPage;
