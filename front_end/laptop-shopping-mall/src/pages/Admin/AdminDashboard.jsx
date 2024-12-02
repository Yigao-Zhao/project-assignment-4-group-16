/* eslint-disable */
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from 'axios';
import { fetchUsers } from '../../services/userService';
import { fetchProducts } from '../../services/productService';
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	TextField,
	IconButton,
	Snackbar,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Alert,
	Grid,
	AppBar,
	CssBaseline
} from "@mui/material";
import { Edit, Save, Add, Delete, Cancel } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Menu } from "@mui/icons-material";

const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer'];

const isadmins = ['Y', 'N'];

const NAVIGATION = [
	{ id: "user-management", label: "User Management" },
	{ id: "product-management", label: "Product Management" },
];

const UserManagement = () => {


	const [users, setUsers] = useState([]);
	const [error, setError] = useState({});
	const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar 
	const [snackbarMessage, setSnackbarMessage] = useState(''); // notification state
	const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // control Snackbar success or false
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // control confirm to delete dialog
	const [userToDelete, setUserToDelete] = useState(null); // store userID ready to be removed
	const [showAddUserDialog, setShowAddUserDialog] = useState(false); //  Add User dialog control

	const defaultNewUser = {
		FirstName: '',
		MiddleName: '',
		LastName: '',
		Address: '',
		Email: '',
		MyPassword: '',
		PaymentMethod: 'Credit Card', // Default to Credit Card
		IsAdmin: 'N', // Default to non-admin
	};

	const [newUser, setNewUser] = useState({ ...defaultNewUser }); // default value for new user

	// edit control state
	const [editUserId, setEditUserId] = useState(null);

	const [tempEditedUser, setTempEditedUser] = useState(null);

	const handleEditClick = (user) => {
		setTempEditedUser({
			...user, // all data of user
			OriginalEmail: user.Email // save original email
		});
		setEditUserId(user.UserID); // set user ID who is editing
	};

	const handleCancelClick = () => {
		setEditUserId(null); // exit edit mode
		setTempEditedUser(null); // temp data delete
	};

	const handleTempUserEdit = (field, value) => {
		setTempEditedUser((prev) => ({ ...prev, [field]: value }));
	};

	const validateUser = (user) => {
		const errors = {};

		// name check
		if (!user.FirstName) {
			errors.FirstName = "First name is required.";
		}

		if (!user.LastName) {
			errors.LastName = "Last name is required.";
		}

		// address check
		if (!user.Address) {
			errors.Address = "Address is required.";
		}

		// email check
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!user.Email) {
			errors.Email = "Email is required.";
		} else if (!emailPattern.test(user.Email)) {
			errors.Email = "Invalid email format.";
		}

		// payment check
		if (!user.PaymentMethod) {
			errors.PaymentMethod = "Payment method is required.";
		}

		// password check
		if (!user.MyPassword) {
			errors.MyPassword = "Password is required.";
		}
		// is admin check
		if (!user.IsAdmin) {
			errors.IsAdmin = "IsAdmin is required.";
		}

		return errors;  
	};

	const checkEmailExists = async (email) => {
		try {
			const response = await axios.get(`http://localhost:5005/api/user/check-email?email=${email}`);
			return response.data.exists;  
		} catch (error) {
			console.error('Error checking email:', error);
			return false;
		}
	};


	const handleUserSave = async () => {

		if (!tempEditedUser) return;

		const validationError = validateUser(tempEditedUser);
		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);
			setError(validationError);
			const errorMessages = Object.values(validationError).join(', ');
			setSnackbarMessage(errorMessages);  
			setSnackbarSeverity('error');  // set error type
			setOpenSnackbar(true); // show Snackbar
			return;
		}

		// check email unique
		if (tempEditedUser.Email !== tempEditedUser.OriginalEmail) { // tempEditedUser record original email
			const emailExists = await checkEmailExists(tempEditedUser.Email);
			if (emailExists) {
				setSnackbarMessage('Email already exists.');
				setSnackbarSeverity('error');
				setOpenSnackbar(true);
				return;
			}
		}

		try {
			if(tempEditedUser.MyPassword.length < 60){
				  tempEditedUser.MyPassword = CryptoJS.SHA256(tempEditedUser.MyPassword).toString();
			}
			
			// BACKEND update
			const response = await axios.put(`http://localhost:5005/api/user/users/${editUserId}`, tempEditedUser);
			console.log(response.data.message); 
			setSnackbarMessage('User saved successfully!');  
			setSnackbarSeverity('success');  
			setOpenSnackbar(true); 

			setUsers((prev) =>
				prev.map((user) =>
					user.UserID === tempEditedUser.UserID
						? { ...user, ...tempEditedUser } // string not edit
						: user
				)
			);

			setEditUserId(null); 
			setTempEditedUser(null);

		} catch (error) {
			console.error('Error saving user:', error);
			setSnackbarMessage('Failed to save user'); 
			setSnackbarSeverity('error');  
			setOpenSnackbar(true);  
		}
	};

	const handleConfirmDelete = (userId) => {
		setUserToDelete(userId); // set userID ready to delete
		setOpenConfirmDialog(true); 
	};


	const handleDeleteUser = async (id) => {
		try {
			console.log('Deleting user with ID:', id);
			const response = await axios.delete(`http://localhost:5005/api/user/users/${id}`);
			console.log('Response from deleteUser:', response.data);
			if (response.data.success) {
				setUsers((prev) => prev.filter((user) => user.UserID !== id));
				setOpenConfirmDialog(false); 
				setSnackbarMessage('User deleted successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

			
				//setUsers((prev) => prev.filter((user) => user.UserID !== id));
			} else {
				throw new Error(response.data.message || 'Failed to delete user');
			}
		} catch (err) {
			console.error('Error deleting user:', err);
			setSnackbarMessage('Failed to delete user');
			setSnackbarSeverity('error');
			setOpenSnackbar(true);
		}
	};


	const handleAddUser = async () => {
		const validationError = validateUser(newUser); 
		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);

		
			setError(validationError);

			setSnackbarMessage("Please correct the errors before submitting.");
			setSnackbarSeverity('error');
			setOpenSnackbar(true); // show Snackbar
			return;
		}

		// check email unique
		const emailExists = await checkEmailExists(newUser.Email);
		if (emailExists) {
			setSnackbarMessage('Email already exists.');
			setSnackbarSeverity('error');
			setOpenSnackbar(true);
			return;
		}


		try {
			
			newUser.MyPassword = CryptoJS.SHA256(newUser.MyPassword).toString();
			const response = await axios.post('http://localhost:5005/api/user/users', newUser);
			if (response.data.success) {
				setSnackbarMessage('User added successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				// update userlist
				setUsers((prevUsers) => [
					...prevUsers,
					{ ...newUser, UserID: response.data.userId } //insert new user to list
				]);
				setShowAddUserDialog(false); 
				setNewUser({ ...defaultNewUser }); 
			} else {
				throw new Error(response.data.message || 'Failed to add user.');
			}
		} catch (error) {
			console.error('Error adding user:', error);
			setSnackbarMessage('Failed to add user.');
			setSnackbarSeverity('error');
			setOpenSnackbar(true);
		}
	};

	const handleFetchUsers = async () => {
		setError('');
		try {
			const response = await fetchUsers();
			if (response && Array.isArray(response.users)) {
				setUsers(response.users); //  users array
			} else {
				throw new Error('Unexpected response format');
			}
		} catch (err) {
			console.error('Error fetching users:', err);
			setError(err.message || 'Failed to fetch users');
		}
	};

	useEffect(() => {
		if (showAddUserDialog) {
			setError(''); 
		}
		handleFetchUsers();
	}, [showAddUserDialog]);

	return (
		<Box>
			{/* Header Section */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => setShowAddUserDialog(true)}
				>
					Add User
				</Button>
			</Box>


			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>First Name <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Middle Name </TableCell>
							<TableCell>Last Name <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Address <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Email <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Payment Method <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Is Admin <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Password <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.UserID}>
								<TableCell>{user.UserID}</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<TextField
											value={tempEditedUser?.FirstName || ''} // temp
											onChange={(e) =>
												handleTempUserEdit('FirstName', e.target.value)
											}
										/>
									) : (
										user.FirstName
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<TextField
											value={tempEditedUser?.MiddleName || ''}
											onChange={(e) =>
												handleTempUserEdit('MiddleName', e.target.value)
											}
										/>
									) : (
										user.MiddleName
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<TextField
											value={tempEditedUser?.LastName || ''}
											onChange={(e) =>
												handleTempUserEdit('LastName', e.target.value)
											}
										/>
									) : (
										user.LastName
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<TextField
											value={tempEditedUser?.Address || ''}
											onChange={(e) =>
												handleTempUserEdit('Address', e.target.value)
											}
										/>
									) : (
										user.Address
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<TextField
											value={tempEditedUser?.Email || ''}
											onChange={(e) =>
												handleTempUserEdit('Email', e.target.value)
											}
										/>
									) : (
										user.Email
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<FormControl fullWidth>
											<Select
												value={tempEditedUser?.PaymentMethod || ''} // temp select value
												onChange={(e) => handleTempUserEdit('PaymentMethod', e.target.value)}
											>
												{paymentMethods.map((method, index) => (
													<MenuItem key={index} value={method}>
														{method}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									) : (
										user.PaymentMethod 
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<FormControl fullWidth>
											<Select
												value={tempEditedUser?.IsAdmin || ''} 
												onChange={(e) => handleTempUserEdit('IsAdmin', e.target.value)}
											>
												{isadmins.map((method, index) => (
													<MenuItem key={index} value={method}>
														{method}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									) : (
										user.IsAdmin
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<TextField
											value={tempEditedUser?.MyPassword || ''}
											onChange={(e) =>
												handleTempUserEdit('MyPassword', e.target.value)
											}
										/>
									) : (
										user.MyPassword
									)}
								</TableCell>

								<TableCell>
									{editUserId === user.UserID ? (
										<Box display="flex" alignItems="center">
											<IconButton onClick={handleUserSave}>
												<Save />
											</IconButton>
											<IconButton onClick={handleCancelClick}>
												<Cancel />
											</IconButton>
										</Box>
									) : (
										<Box display="flex" alignItems="center">
											<IconButton onClick={() => {
												handleEditClick(user);
											}}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleConfirmDelete(user.UserID)}>
												<Delete />
											</IconButton>
										</Box>
									)}
								</TableCell>

								{/* delete confirm dialog */}
								<Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} disableEnforceFocus={false} 
  autoFocus={true} >
									<DialogTitle>Confirm Deletion</DialogTitle>
									<DialogContent>
										Are you sure you want to delete this user?
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setOpenConfirmDialog(false)} color="primary">
											Cancel
										</Button>
										<Button
											onClick={() => handleDeleteUser(user.UserID)} // transfer userId
											color="secondary"
											variant="contained"
										>
											Delete
										</Button>
									</DialogActions>
								</Dialog>

								<Dialog open={showAddUserDialog}
									onClose={() => {
										setShowAddUserDialog(false);
										setNewUser({ ...defaultNewUser }); // reset data
										setError({}); 
									}}
									disableEnforceFocus={false} 
									autoFocus={true} 
								>
									<DialogTitle>Add New User</DialogTitle>
									<DialogContent>
										<TextField
											label="First Name"
											fullWidth
											value={newUser.FirstName}
											onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
											required
											error={!!error?.FirstName}
											helperText={error?.FirstName || ''}
											margin="dense"
										/>
										<TextField
											label="Middle Name"
											fullWidth
											value={newUser.MiddleName}
											onChange={(e) => setNewUser({ ...newUser, MiddleName: e.target.value })}
											margin="dense"
										/>
										<TextField
											label="Last Name"
											fullWidth
											value={newUser.LastName}
											onChange={(e) => setNewUser({ ...newUser, LastName: e.target.value })}
											required
											error={!!error?.LastName}
											helperText={error?.LastName || ''}
											margin="dense"
										/>
										<TextField
											label="Address"
											fullWidth
											value={newUser.Address}
											onChange={(e) => setNewUser({ ...newUser, Address: e.target.value })}
											required
											error={!!error?.Address}
											helperText={error?.Address || ''}
											margin="dense"
										/>
										<TextField
											label="Email"
											fullWidth
											value={newUser.Email}
											onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
											required
											error={!!error?.Email}
											helperText={error?.Email || ''}
											margin="dense"
										/>
										{/* Payment Method Dropdown */}
										<FormControl fullWidth margin="normal">
											<InputLabel id="payment-method-label">Payment Method</InputLabel>
											<Select
												labelId="payment-method-label"
												value={newUser.PaymentMethod || ''}
												onChange={(e) => setNewUser({ ...newUser, PaymentMethod: e.target.value })}
												required
												error={!!error?.PaymentMethod}
												margin="dense"
											>
												{paymentMethods.map((method, index) => (
													<MenuItem key={index} value={method}>
														{method}
													</MenuItem>
												))}
											</Select>
										</FormControl>
										{/* Is Admin Dropdown */}
										<FormControl fullWidth margin="normal">
											<InputLabel id="is-admin-label">Is Admin</InputLabel>
											<Select
												labelId="is-admin-label"
												value={newUser.IsAdmin || ''}
												onChange={(e) => setNewUser({ ...newUser, IsAdmin: e.target.value })}
												required
												error={!!error?.IsAdmin}
												margin="dense"
											>
												<MenuItem value="Y">Y</MenuItem>
												<MenuItem value="N">N</MenuItem>
											</Select>
										</FormControl>

										<TextField
											label="Password"
											fullWidth
											value={newUser.MyPassword}
											onChange={(e) => setNewUser({ ...newUser, MyPassword: e.target.value })}
											required
											error={!!error?.MyPassword}
											helperText={error?.MyPassword || ''}
											margin="dense"
										/>
									</DialogContent>
									<DialogActions>
										<Button
											onClick={() => {
												setShowAddUserDialog(false);
												setNewUser({ ...defaultNewUser });
												setError({}); 
											}}
										>
											Cancel
										</Button>
										<Button onClick={() => {
											handleAddUser(newUser);
											//setNewUser({ ...defaultNewUser });
										}}>
											Add User
										</Button>
									</DialogActions>
								</Dialog>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity={snackbarSeverity} // colour for Success of Fail
					sx={{ width: '100%' }}
				>
					{snackbarMessage}  {/* notification */}
				</Alert>
			</Snackbar>
		</Box>

	);
}



const ProductManagement = () => {

	const [products, setProducts] = useState([]);
	const [error, setError] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);  
	const [editProductId, setEditProductId] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState(''); 
	const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false); 
	const [productToDelete, setProductToDelete] = useState(null); 
	const [tempEditedProduct, setTempEditedProduct] = useState(null); 

	const [showAddProductDialog, setShowAddProductDialog] = useState(false); 

	const defaultNewProduct = {

		ProductName: '',
		ProductType: '',
		ProductSpecifications: '',
		ProductImage: '',
		ProductPrice: '',
		ProductStock: '',
	};

	const [newProduct, setNewProduct] = useState(defaultNewProduct); // default value


	const handleProductCancel = () => {
	
		setEditProductId(null);
		setTempEditedProduct(null);
	};

	const handleTempProductEdit = (field, value) => {
		setTempEditedProduct((prev) => ({ ...prev, [field]: value }));
	};


	const handleEditClick = (product) => {
		setEditProductId(product.ProductID);
		setTempEditedProduct({ ...product }); // product reatore to temp
	};

	const validateImageOnServer = async (imagePath) => {
		try {
			const response = await fetch(`http://localhost:5005/images/${imagePath}`, { method: 'HEAD' });
			if (response.ok) {
				return true; 
			} else {
				return false;
			}
		} catch (error) {
			console.error('检查图片时出错:', error);
			return false; 
		}
	};

	const validateProduct = async (product) => {
		const errors = {};
		if (!product.ProductName) {
			errors.ProductName = "Product name is required.";
		}
		if (!product.ProductType) {
			errors.ProductType = "Product type is required.";
		}

		

		if (product.ProductPrice === "") {
			errors.ProductPrice = "Product price is required.";
		}

		const price = Number(product.ProductPrice);
		if (isNaN(price) || price <= 0) {
			errors.ProductPrice = "Product price must be a number greater than zero.";
		}

		if (product.ProductStock === "") {
			errors.ProductStock = "Product stock is required.";
		}

		const stock = Number(product.ProductStock);

		if (isNaN(stock) || stock <= 0 || !Number.isInteger(stock)) {
			errors.ProductStock = "Product stock must be a positive integer.";
		}
		return errors; // null = no problems
	};

	const handleProductSave = async () => {
		if (!tempEditedProduct) return;
		// quantity check

		const validationError = await validateProduct(tempEditedProduct);

		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);
			setError(validationError);
			const errorMessages = Object.values(validationError).join(', ');
			setSnackbarMessage(errorMessages);  
			setSnackbarSeverity('error');  
			setOpenSnackbar(true); 
			return;
		}

		try {
			//  API update product
			const response = await axios.put(`http://localhost:5005/api/product/products/${editProductId}`, tempEditedProduct);

			console.log(response.data.message); 
			setSnackbarMessage('Product saved successfully!');  
			setSnackbarSeverity('success');  
			setOpenSnackbar(true);
			setEditProductId(null); 
			setTempEditedProduct(null); 
			// get list again
			handleFetchProducts();
		} catch (error) {
			console.error('Error saving product:', error);
			const errorMessage = error.response?.data?.message || 'Failed to save product';
			console.error('Error saving product:', errorMessage);
			setSnackbarMessage(errorMessage); 
			setSnackbarSeverity('error');  
			setOpenSnackbar(true);  
		}
	};


	const handleDeleteProduct = async (id) => {
		try {
			const response = await axios.delete(`http://localhost:5005/api/product/products/${productToDelete}`);
			if (response.data.success) {
				setProducts((prev) => prev.filter((product) => product.ProductID !== productToDelete));
				setOpenConfirmDialog(false); 
				setSnackbarMessage('Product deleted successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				
				setProducts((prev) => prev.filter((product) => product.ProductID !== id));
			} else {
				throw new Error(response.data.message || 'Failed to delete product');
			}
		} catch (err) {
			console.error('Error deleting product:', err);
			setSnackbarMessage('Failed to delete product');
			setSnackbarSeverity('error');
			setOpenSnackbar(true);
		}
	};

	const handleConfirmDelete = (productId) => {
		setProductToDelete(productId);
		setOpenConfirmDialog(true); 
	};

	const handleAddProduct = async () => {
		const validationError = await validateProduct(newProduct); 
		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);

		
			setError(validationError);

			
			//const errorMessages = Object.values(validationError).join(', ');
			setSnackbarMessage('Please correct the errors before submitting.');
			setSnackbarSeverity('error');
			setOpenSnackbar(true); // show Snackbar
			return;
		}


		try {
			const response = await axios.post('http://localhost:5005/api/product/products', newProduct);
			if (response.data.success) {
				setSnackbarMessage('Product added successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				// update product list
				setProducts((prevProducts) => [
					...prevProducts,
					{ ...newProduct, ProductID: response.data.productId } // new product to list
				]);
				setShowAddProductDialog(false); 
				setNewProduct({ ...defaultNewProduct });

			} else {
				throw new Error(response.data.message || 'Failed to add product.');
			}
		} catch (error) {
			console.error('Error adding product:', error);
			setSnackbarMessage('Failed to add product.');
			setSnackbarSeverity('error');
			setOpenSnackbar(true);
		}
	};

	const handleFetchProducts = async () => {
		setError('');
		try {
			const response = await fetchProducts();
			console.log('Response from fetchProducts:', response);
			if (response && Array.isArray(response.products)) {
				setProducts(response.products); 
			} else {
				throw new Error('Unexpected response format');
			}
		} catch (err) {
			console.error('Failed to fetch data:', error.message);
			setError(err.message);
		}
	};
	
	const handleADDImageUpload = async (e) => {
	    const file = e.target.files[0];
	    try {
	        const compressedBase64 = await compressImage(file, 0.2);
			setNewProduct({ ...newProduct, ProductImage: compressedBase64 })
			
	    } catch (error) {
	        console.error('Error compressing image:', error);
	    }
	};
	const handleImageUpload = async (e) => {
	    const file = e.target.files[0];
	    try {
	        const compressedBase64 = await compressImage(file, 0.2);
			handleTempProductEdit('ProductImage', compressedBase64);
			
	    } catch (error) {
	        console.error('Error compressing image:', error);
	    }
	};
	const compressImage = (file, quality = 0.7) => {
	    return new Promise((resolve, reject) => {
	        const reader = new FileReader();
	        reader.onload = (event) => {
	            const img = new Image();
	            img.onload = () => {
	                const canvas = document.createElement('canvas');
	                const ctx = canvas.getContext('2d');
	
	                //picture ratio
	                const maxWidth = 800;
	                const maxHeight = 800;
	                let width = img.width;
	                let height = img.height;
	
	                if (width > height && width > maxWidth) {
	                    height = (height * maxWidth) / width;
	                    width = maxWidth;
	                } else if (height > width && height > maxHeight) {
	                    width = (width * maxHeight) / height;
	                    height = maxHeight;
	                }
	
	                canvas.width = width;
	                canvas.height = height;
	                ctx.drawImage(img, 0, 0, width, height);
	
	                // trransfer pic into Base64 data
	                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
	                resolve(compressedBase64);
	            };
	            img.onerror = (error) => reject(error);
	            img.src = event.target.result;
	        };
	        reader.onerror = (error) => reject(error);
	        reader.readAsDataURL(file);
	    });
	};

	useEffect(() => {
		if (showAddProductDialog) {
			setError(''); 
		}
		handleFetchProducts();
	}, [showAddProductDialog]);


	return (
		<Box>
			{/* Header Section */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => setShowAddProductDialog(true)}
				>
					Add Product
				</Button>
			</Box>



			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Type <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Specifications</TableCell>
							<TableCell>Image</TableCell>
							<TableCell>Price($) <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Stock <span style={{ color: 'red' }}>*</span></TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.map((product) => (
							<TableRow key={product.ProductID}>
								<TableCell>{product.ProductID}</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={tempEditedProduct?.ProductName || ''}
											onChange={(e) =>
												handleTempProductEdit("ProductName", e.target.value)
											}
										/>
									) : (
										product.ProductName
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={tempEditedProduct?.ProductType || ''}
											onChange={(e) =>
												handleTempProductEdit("ProductType", e.target.value)
											}
										/>
									) : (
										product.ProductType
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={tempEditedProduct?.ProductSpecifications || ''}
											onChange={(e) =>
												handleTempProductEdit("ProductSpecifications", e.target.value)
											}
										/>
									) : (
										product.ProductSpecifications
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<Box style={{ display: 'flex', alignItems: 'center' }}>
											{/* pic show */}
											
											{/* path*/}
											<Box style={{ display: 'flex', alignItems: 'center' }}>
											    {/* show present pic */}
											    {tempEditedProduct?.ProductImage && (
											        <img
											            src={tempEditedProduct.ProductImage}
											            alt="Product Preview"
											            style={{
											                width: '80px',
											                height: '80px',
											                objectFit: 'cover',
											                marginRight: '10px',
											            }}
											        />
											    )}
											    {/* upload */}
											    <Button
											        variant="contained"
											        component="label"
											        size="small"
											        sx={{ marginRight: '10px' }}
											    >
											        Upload Image
											        <input
											            type="file"
											            accept="image/*"
											            hidden
											            onChange={(e) => handleImageUpload(e)}
											        />
											    </Button>
											</Box>
										</Box>
									) : (
										<img
											src={product.ProductImage}
											alt={product.ProductName}
											style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
										/>
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={tempEditedProduct?.ProductPrice || ''}
											onChange={(e) =>
												handleTempProductEdit("ProductPrice", e.target.value)
											}
										/>
									) : (
										product.ProductPrice
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={tempEditedProduct?.ProductStock || ''}
											onChange={(e) =>
												handleTempProductEdit("ProductStock", e.target.value)
											}
										/>
									) : (
										product.ProductStock
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (

										<Box display="flex" alignItems="center">
											<IconButton onClick={handleProductSave}>
												<Save />
											</IconButton>
											<IconButton onClick={handleProductCancel}>
												<Cancel />
											</IconButton>
										</Box>

									) : (
										<Box display="flex" alignItems="center">
											<IconButton onClick={() => handleEditClick(product)}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleConfirmDelete(product.ProductID)}>
												<Delete />
											</IconButton>
										</Box>
									)}

									{/* delete confirm dialog */}
									<Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}
									disableEnforceFocus={false} 
									  autoFocus={true} >
										<DialogTitle>Confirm Deletion</DialogTitle>
										<DialogContent>
											Are you sure you want to delete this product?
										</DialogContent>
										<DialogActions>
											<Button onClick={() => setOpenConfirmDialog(false)} color="primary">
												Cancel
											</Button>
											<Button
												onClick={handleDeleteProduct}
												color="secondary"
												variant="contained"
											>
												Delete
											</Button>
										</DialogActions>
									</Dialog>

									<Dialog open={showAddProductDialog}
										onClose={() => {
											setShowAddProductDialog(false);
											setNewProduct({ ...defaultNewProduct }); 
										}}
										disableEnforceFocus={false} 
										  autoFocus={true} 
									>
										<DialogTitle>Add New Product</DialogTitle>
										<DialogContent>
											<TextField
												label="Product Name"
												fullWidth
												value={newProduct.ProductName}
												onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })}
												required
												error={!!error?.ProductName}
												helperText={error?.ProductName || ''}
												margin="dense"
											/>
											<TextField
												label="Product Type"
												fullWidth
												value={newProduct.ProductType}
												onChange={(e) => setNewProduct({ ...newProduct, ProductType: e.target.value })}
												required
												error={!!error?.ProductType}
												helperText={error?.ProductType || ''}
												margin="dense"
											/>
											<TextField
												label="Product Specifications"
												fullWidth
												value={newProduct.ProductSpecifications}
												onChange={(e) => setNewProduct({ ...newProduct, ProductSpecifications: e.target.value })}
												margin="dense"
											/>
											{newProduct.ProductImage && (
											    <img
											        src={newProduct.ProductImage}
											        alt="Product Preview"
											        style={{
											            width: '80px',
											            height: '80px',
											            objectFit: 'cover',
											            marginRight: '10px',
											        }}
											    />
											)}
											<Button
											    variant="contained"
											    component="label"
											    size="small"
											    sx={{ marginRight: '10px' }}
											>
											    Upload Image
											    <input
											        type="file"
											        accept="image/*"
											        hidden
											        onChange={(e) => handleADDImageUpload(e)}
											    />
											</Button>
											<TextField
												label="Product Price"
												fullWidth
												value={newProduct.ProductPrice}
												onChange={(e) => setNewProduct({ ...newProduct, ProductPrice: e.target.value })}
												required
												error={!!error?.ProductPrice}
												helperText={error?.ProductPrice || ''}
												margin="dense"
											/>
											<TextField
												label="Product Stock"
												fullWidth
												value={newProduct.ProductStock}
												onChange={(e) => setNewProduct({ ...newProduct, ProductStock: e.target.value })}
												required
												error={!!error?.ProductStock}
												helperText={error?.ProductStock || ''}
												margin="dense"
											/>
										</DialogContent>
										<DialogActions>
											<Button onClick={() => {
												setShowAddProductDialog(false);
												setNewProduct({ ...defaultNewProduct });
												setError({});
											}}
											>
												Cancel
											</Button>

											<Button onClick={async () => {
												await handleAddProduct(newProduct);
												//setNewProduct({ ...defaultNewProduct });
											}}
											>
												Add Product
											</Button>
										</DialogActions>
									</Dialog>


								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>


			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity={snackbarSeverity} 
					sx={{ width: '100%' }}
				>
					{snackbarMessage}  {/* notification */}
				</Alert>
			</Snackbar>
		</Box>

	);
}

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('User Management');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      {/* small screen AppBar */}
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* reponsive Drawer */}
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            zIndex: (theme) => theme.zIndex.appBar - 1,
			marginTop:6
          },
        }}
      >
        {isSmallScreen && <Toolbar />}
        <List>
          {NAVIGATION.map((item) => (
            <ListItem
              button="true"
              key={item.id}
              onClick={() => {
                setSelectedSection(item.label);
                if (isSmallScreen) {
                  setDrawerOpen(false); // in small screen close Drawer
                }
              }}
              selected={selectedSection === item.label}
              sx={{
                backgroundColor: selectedSection === item.label ? "lightblue" : "inherit",
                "&:hover": {
                  backgroundColor: selectedSection === item.label ? "lightblue" : "lightgray",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          marginTop: isSmallScreen ? "64px" : 0,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {selectedSection}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {selectedSection === "User Management" && <UserManagement />}
            {selectedSection === "Product Management" && <ProductManagement />}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;