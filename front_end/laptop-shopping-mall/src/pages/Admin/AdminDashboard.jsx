import React, { useState, useEffect } from "react";
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
	Alert
} from "@mui/material";
import { Edit, Save, Add, Delete, Cancel } from "@mui/icons-material";

const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer'];

const isadmins = ['Y', 'N'];

const NAVIGATION = [
	{ id: "user-management", label: "User Management" },
	{ id: "product-management", label: "Product Management" },
];

const UserManagement = () => {


	const [users, setUsers] = useState([]);
	const [error, setError] = useState({});
	const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar 显示状态
	const [snackbarMessage, setSnackbarMessage] = useState(''); // 显示的提示消息
	const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 控制 Snackbar 类型（成功或错误
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // 控制确认删除对话框
	const [userToDelete, setUserToDelete] = useState(null); // 存储待删除的userID
	const [showAddUserDialog, setShowAddUserDialog] = useState(false); // 控制 Add User 弹窗显示

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

	const [newUser, setNewUser] = useState({ ...defaultNewUser }); // 新用户的默认值

	// 编辑状态控制
	const [editUserId, setEditUserId] = useState(null);

	const [tempEditedUser, setTempEditedUser] = useState(null);

	const handleEditClick = (user) => {
		setTempEditedUser({
			...user, // 传入当前用户的所有数据
			OriginalEmail: user.Email // 保存用户原始的邮箱
		});
		setEditUserId(user.UserID); // 设置正在编辑的用户ID
	};

	const handleCancelClick = () => {
		setEditUserId(null); // 退出编辑模式
		setTempEditedUser(null); // 清除临时编辑数据
	};

	const handleTempUserEdit = (field, value) => {
		setTempEditedUser((prev) => ({ ...prev, [field]: value }));
	};

	const validateUser = (user) => {
		const errors = {};

		// 姓名字段校验
		if (!user.FirstName) {
			errors.FirstName = "First name is required.";
		}

		if (!user.LastName) {
			errors.LastName = "Last name is required.";
		}

		// 地址字段校验
		if (!user.Address) {
			errors.Address = "Address is required.";
		}

		// 邮箱校验
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!user.Email) {
			errors.Email = "Email is required.";
		} else if (!emailPattern.test(user.Email)) {
			errors.Email = "Invalid email format.";
		}

		// 支付方式校验
		if (!user.PaymentMethod) {
			errors.PaymentMethod = "Payment method is required.";
		}

		// 支付方式校验
		if (!user.MyPassword) {
			errors.MyPassword = "Password is required.";
		}
		// 管理员标志校验
		if (!user.IsAdmin) {
			errors.IsAdmin = "IsAdmin is required.";
		}

		return errors;  // 返回包含错误信息的对象
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


	const handleUserSave = async () => {

		if (!tempEditedUser) return;

		const validationError = validateUser(tempEditedUser);
		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);
			setError(validationError);
			const errorMessages = Object.values(validationError).join(', ');
			setSnackbarMessage(errorMessages);  // 设置错误消息
			setSnackbarSeverity('error');  // 设置错误类型
			setOpenSnackbar(true); // 显示 Snackbar
			return;
		}

		// 检查邮箱是否唯一，只在邮箱被修改时执行
		if (tempEditedUser.Email !== tempEditedUser.OriginalEmail) { // 需要在tempEditedUser中记录原始邮箱
			const emailExists = await checkEmailExists(tempEditedUser.Email);
			if (emailExists) {
				setSnackbarMessage('Email already exists.');
				setSnackbarSeverity('error');
				setOpenSnackbar(true);
				return;
			}
		}

		try {
			// 调用后端 API 更新user
			const response = await axios.put(`http://localhost:5005/api/user/users/${editUserId}`, tempEditedUser);
			console.log(response.data.message); // 打印成功消息
			setSnackbarMessage('User saved successfully!');  // 设置成功消息
			setSnackbarSeverity('success');  // 设置成功类型
			setOpenSnackbar(true); // 显示提示

			setUsers((prev) =>
				prev.map((user) =>
					user.UserID === tempEditedUser.UserID
						? { ...user, ...tempEditedUser } // 合并未编辑的字段
						: user
				)
			);

			setEditUserId(null); // 退出编辑模式
			setTempEditedUser(null); // 清空临时状态

		} catch (error) {
			console.error('Error saving user:', error);
			setSnackbarMessage('Failed to save user'); // 设置错误消息
			setSnackbarSeverity('error');  // 设置错误类型
			setOpenSnackbar(true);  // 显示错误消息
		}
	};


	const handleDeleteUser = async (id) => {
		try {
			const response = await axios.delete(`http://localhost:5005/api/user/users/${userToDelete}`);

			if (response.data.success) {
				setUsers((prev) => prev.filter((user) => user.UserID !== userToDelete));
				setOpenConfirmDialog(false); // 关闭确认对话框
				setSnackbarMessage('User deleted successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				// 更新本地状态
				setUsers((prev) => prev.filter((user) => user.UserID !== id));
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

	const handleConfirmDelete = (userId) => {
		setUserToDelete(userId); // 设置待删除的userID
		setOpenConfirmDialog(true); // 打开删除确认对话框
	};

	const handleAddUser = async () => {
		const validationError = validateUser(newUser); // 使用通用的校验函数
		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);

			// 更新错误信息状态
			setError(validationError);

			// 显示错误消息
			setSnackbarMessage("Please correct the errors before submitting.");
			setSnackbarSeverity('error');
			setOpenSnackbar(true); // 显示 Snackbar
			return;
		}

		// 在保存之前先校验邮箱是否唯一
		const emailExists = await checkEmailExists(newUser.Email);
		if (emailExists) {
			setSnackbarMessage('Email already exists.');
			setSnackbarSeverity('error');
			setOpenSnackbar(true);
			return;
		}


		try {
			const response = await axios.post('http://localhost:5005/api/user/users', newUser);
			if (response.data.success) {
				setSnackbarMessage('User added successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				// 更新用户列表
				setUsers((prevUsers) => [
					...prevUsers,
					{ ...newUser, UserID: response.data.userId } // 添加新用户到列表
				]);
				setShowAddUserDialog(false); // 关闭添加用户对话框
				setNewUser({ ...defaultNewUser }); // 清空表单数据
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
			const userList = await fetchUsers();
			setUsers(userList);
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		if (showAddUserDialog) {
			setError({}); // 清空错误信息
		}
		handleFetchUsers();
	}, [showAddUserDialog]);

	return (
		<div>
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
											value={tempEditedUser?.FirstName || ''} // 临时保存的值
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
												value={tempEditedUser?.PaymentMethod || ''} // 临时保存选中的值
												onChange={(e) => handleTempUserEdit('PaymentMethod', e.target.value)}// 更新临时状态
											>
												{paymentMethods.map((method, index) => (
													<MenuItem key={index} value={method}>
														{method}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									) : (
										user.PaymentMethod // 显示最终保存的支付方式
									)}
								</TableCell>
								<TableCell>
									{editUserId === user.UserID ? (
										<FormControl fullWidth>
											<Select
												value={tempEditedUser?.IsAdmin || ''} // 临时保存选中的值
												onChange={(e) => handleTempUserEdit('IsAdmin', e.target.value)}// 更新临时状态
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

								{/* 删除确认对话框 */}
								<Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
									<DialogTitle>Confirm Deletion</DialogTitle>
									<DialogContent>
										Are you sure you want to delete this user?
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setOpenConfirmDialog(false)} color="primary">
											Cancel
										</Button>
										<Button
											onClick={handleDeleteUser}
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
										setNewUser({ ...defaultNewUser }); // 重置表单数据
										setError({}); // 清空错误信息
									}}
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
												helperText={error?.PaymentMethod || ''}
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
												helperText={error?.IsAdmin || ''}
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
												setError({}); // 关闭时清空错误信息
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
					severity={snackbarSeverity} // 根据错误或成功显示不同颜色
					sx={{ width: '100%' }}
				>
					{snackbarMessage}  {/* 显示提示消息 */}
				</Alert>
			</Snackbar>
		</div>

	);
}



const ProductManagement = () => {

	const [products, setProducts] = useState([]);
	const [error, setError] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar 显示状态
	const [editProductId, setEditProductId] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState(''); // 显示的提示消息
	const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 控制 Snackbar 类型（成功或错误）
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // 控制确认删除对话框
	const [productToDelete, setProductToDelete] = useState(null); // 存储待删除的产品ID
	const [tempEditedProduct, setTempEditedProduct] = useState(null); // 临时保存编辑的产品数据

	const [showAddProductDialog, setShowAddProductDialog] = useState(false); // 控制 Add User 弹窗显示

	const defaultNewProduct = {

		ProductName: '',
		ProductType: '',
		ProductSpecifications: '',
		ProductImage: '',
		ProductPrice: '',
		ProductStock: '',
	};

	const [newProduct, setNewProduct] = useState(defaultNewProduct); // 新产品的默认值


	const handleProductCancel = () => {
		// 取消编辑时，恢复原始数据
		setEditProductId(null);
		setTempEditedProduct(null); // 清除临时保存的编辑数据
	};

	const handleTempProductEdit = (field, value) => {
		setTempEditedProduct((prev) => ({ ...prev, [field]: value }));
	};


	const handleEditClick = (product) => {
		setEditProductId(product.ProductID);
		setTempEditedProduct({ ...product }); // 将product数据复制到临时状态
	};

	const validateImageOnServer = async (imagePath) => {
		try {
			const response = await fetch(`http://localhost:5005/images/${imagePath}`, { method: 'HEAD' });
			if (response.ok) {
				return true; // 图片存在
			} else {
				return false; // 图片不存在
			}
		} catch (error) {
			console.error('检查图片时出错:', error);
			return false; // 请求失败则认为图片不存在
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

		if (product.ProductImage) {
			const imageExists = await validateImageOnServer(product.ProductImage);
			if (!imageExists) {
				errors.ProductImage = "Product image does not exist.";
			}
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
		return errors; // 返回 null 表示没有错误
	};

	const handleProductSave = async () => {
		if (!tempEditedProduct) return;
		// 验证产品数据

		const validationError = await validateProduct(tempEditedProduct);

		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);
			setError(validationError);
			const errorMessages = Object.values(validationError).join(', ');
			setSnackbarMessage(errorMessages);  // 设置错误消息
			setSnackbarSeverity('error');  // 设置错误类型
			setOpenSnackbar(true); // 显示 Snackbar
			return;
		}

		try {
			// 调用后端 API 更新产品
			const response = await axios.put(`http://localhost:5005/api/product/products/${editProductId}`, tempEditedProduct);

			console.log(response.data.message); // 打印成功消息
			setSnackbarMessage('Product saved successfully!');  // 设置成功消息
			setSnackbarSeverity('success');  // 设置成功类型
			setOpenSnackbar(true); // 显示提示
			setEditProductId(null); // 退出编辑模式
			setTempEditedProduct(null); // 清除临时编辑数据
			// 重新获取产品列表
			handleFetchProducts();
		} catch (error) {
			console.error('Error saving product:', error);
			const errorMessage = error.response?.data?.message || 'Failed to save product';
			console.error('Error saving product:', errorMessage);
			setSnackbarMessage(errorMessage); // 设置错误消息
			setSnackbarSeverity('error');  // 设置错误类型
			setOpenSnackbar(true);  // 显示错误消息
		}
	};


	const handleDeleteProduct = async (id) => {
		try {
			const response = await axios.delete(`http://localhost:5005/api/product/products/${productToDelete}`);
			if (response.data.success) {
				setProducts((prev) => prev.filter((product) => product.ProductID !== productToDelete));
				setOpenConfirmDialog(false); // 关闭确认对话框
				setSnackbarMessage('Product deleted successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				// 更新本地状态
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
		setProductToDelete(productId); // 设置待删除的产品ID
		setOpenConfirmDialog(true); // 打开删除确认对话框
	};

	const handleAddProduct = async () => {
		const validationError = await validateProduct(newProduct); // 使用通用的校验函数
		if (Object.keys(validationError).length > 0) {
			console.log("Validation failed:", validationError);

			// 更新错误信息状态
			setError(validationError);

			// 显示错误消息
			//const errorMessages = Object.values(validationError).join(', ');
			setSnackbarMessage('Please correct the errors before submitting.');
			setSnackbarSeverity('error');
			setOpenSnackbar(true); // 显示 Snackbar
			return;
		}


		try {
			const response = await axios.post('http://localhost:5005/api/product/products', newProduct);
			if (response.data.success) {
				setSnackbarMessage('Product added successfully!');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);

				// 更新product列表
				setProducts((prevProducts) => [
					...prevProducts,
					{ ...newProduct, ProductID: response.data.productId } // 添加新product到列表
				]);
				setShowAddProductDialog(false); // 关闭添加product对话框
				setNewProduct({ ...defaultNewProduct }); // 清空表单数据

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
			const productList = await fetchProducts();
			setProducts(productList);
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		if (showAddProductDialog) {
			setError({}); // 清空错误信息
		}
		handleFetchProducts();
	}, [showAddProductDialog]);


	return (
		<div>
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
										<div style={{ display: 'flex', alignItems: 'center' }}>
											{/* 显示当前图片 */}
											<img
												src={tempEditedProduct?.ProductImage ? `/image/${tempEditedProduct.ProductImage}` : ''}
												alt={product.ProductName}
												style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
											/>
											{/* 提供输入框修改图片路径 */}
											<TextField
												value={tempEditedProduct?.ProductImage || ''}
												onChange={(e) => handleTempProductEdit("ProductImage", e.target.value)}
												placeholder="Enter image URL"
												fullWidth
											/>
										</div>
									) : (
										<img
											src={product.ProductImage ? `/image/${product.ProductImage}` : ''}
											alt={product.ProductName}
											style={{ width: '80px', height: '80px', objectFit: 'cover' }}
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

									{/* 删除确认对话框 */}
									<Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
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
											setNewProduct({ ...defaultNewProduct }); // 重置表单数据
										}}
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
											<TextField
												label="Product Image"
												fullWidth
												value={newProduct.ProductImage}
												onChange={(e) => setNewProduct({ ...newProduct, ProductImage: e.target.value })}
												error={!!error?.ProductImage}
												helperText={error?.ProductImage || ''}
												margin="dense"
											/>
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
					severity={snackbarSeverity} // 根据错误或成功显示不同颜色
					sx={{ width: '100%' }}
				>
					{snackbarMessage}  {/* 显示提示消息 */}
				</Alert>
			</Snackbar>
		</div>

	);
}

const AdminDashboard = () => {
	const [selectedSection, setSelectedSection] = useState('User Management');

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			{/* 侧边栏导航 */}
			<Drawer
				variant="permanent"
				sx={{
					width: 240,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: 240,
						boxSizing: "border-box",
						zIndex: (theme) => theme.zIndex.appBar - 1,
					},
				}}
			>
				<Toolbar />
				<List>
					{NAVIGATION.map((item) => (
						<ListItem
							button
							key={item.id}
							onClick={() => setSelectedSection(item.label)}
							selected={selectedSection === item.label}
							sx={{
								backgroundColor: selectedSection === item.label ? "lightblue" : "inherit",
								"&:hover": {
									backgroundColor: selectedSection === item.label ? "lightblue" : "lightgray", // 保持选中时背景不变
								},
							}}
						>
							<ListItemText primary={item.label} />
						</ListItem>
					))}
				</List>
			</Drawer>
			{/* 主内容区域 */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				<Typography variant="h4" gutterBottom>
					{selectedSection}
				</Typography>
				{selectedSection === "User Management" && <UserManagement />}
				{selectedSection === "Product Management" && <ProductManagement />}
			</Box>


		</Box >
	);
};

export default AdminDashboard;