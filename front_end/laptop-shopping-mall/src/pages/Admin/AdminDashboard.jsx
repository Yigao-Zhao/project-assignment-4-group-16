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
import { Edit, Save, Add, Delete } from "@mui/icons-material";

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
	const [newUser, setNewUser] = useState({
		FirstName: '',
		LastName: '',
		Address: '',
		Email: '',
		PaymentMethod: 'Credit Card', // 默认值为信用卡
		IsAdmin: 'N', // 默认值为非管理员
	});

	// 编辑状态控制
	const [editUserId, setEditUserId] = useState(null);

	const [tempEditedUser, setTempEditedUser] = useState(null);

	const handleEditClick = (user) => {
		setEditUserId(user.UserID);
		setTempEditedUser({ ...user }); // 将用户数据复制到临时状态
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
	
		// 管理员标志校验
		if (!user.IsAdmin) {
			errors.IsAdmin = "IsAdmin is required.";
		}
	
		return errors;  // 返回包含错误信息的对象
	};

	const handleUserSave = async () => {

		if (!tempEditedUser) return;

		const validationError = validateUser(tempEditedUser);
		if (Object.keys(validationError).length > 0){
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
		handleFetchUsers();
	}, []);

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
										<IconButton onClick={handleUserSave}>
											<Save />
										</IconButton>
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

								<Dialog open={showAddUserDialog} onClose={() => setShowAddUserDialog(false)}>
									<DialogTitle>Add New User</DialogTitle>
									<DialogContent>
										<TextField
											label="First Name"
											fullWidth
											value={newUser.FirstName}
											onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
											required
											error={!!error?.FirstName}
											helperText={error?.FirstName||''}
											margin="dense"
										/>
										<TextField
											label="Middle Name"
											fullWidth
											value={newUser.MiddleName}
											onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
										/>
										<TextField
											label="Last Name"
											fullWidth
											value={newUser.LastName}
											onChange={(e) => setNewUser({ ...newUser, LastName: e.target.value })}
											required
											error={!!error?.LastName}
											helperText={error?.LastName||''}
											margin="dense"
										/>
										<TextField
											label="Address"
											fullWidth
											value={newUser.Address}
											onChange={(e) => setNewUser({ ...newUser, Address: e.target.value })}
											required
											error={!!error?.Address}
											helperText={error?.Address||''}
											margin="dense"
										/>
										<TextField
											label="Email"
											fullWidth
											value={newUser.Email}
											onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
											required
											error={!!error?.Email}
											helperText={error?.Email||''}
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
												helperText={error?.PaymentMethod||''}
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
												helperText={error?.IsAdmin||''}
												margin="dense"
											>
												<MenuItem value="Y">Yes</MenuItem>
												<MenuItem value="N">No</MenuItem>
											</Select>
										</FormControl>
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setShowAddUserDialog(false)}>Cancel</Button>
										<Button onClick={() => handleAddUser(newUser)}>Add User</Button>
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

	const handleProductEdit = (id, field, value) => {
		setProducts((prev) =>
			prev.map((product) => (product.ProductID === id ? { ...product, [field]: value } : product))
		);
	};

	const validateProduct = (product) => {
		if (!product.ProductName) {
			return "Product name is required.";
		}
		if (!product.ProductType) {
			return "Product type is required.";
		}

		if (product.ProductPrice === "") {
			return "Product price is required.";
		}

		const price = Number(product.ProductPrice);
		if (isNaN(price) || price <= 0) {
			return "Product price must be a number greater than zero.";
		}

		if (product.ProductStock === "") {
			return "Product stock is required.";
		}

		const stock = Number(product.ProductStock);

		if (isNaN(stock) || stock < 0) {
			return "Product stock must be a number greater than or equal to zero.";
		}
		return null; // 返回 null 表示没有错误
	};

	const handleProductSave = async () => {
		const productToSave = products.find((p) => p.ProductID === editProductId);

		// 验证产品数据
		const validationError = validateProduct(productToSave);
		if (validationError) {
			console.log("Validation failed:", validationError);
			setError(validationError);
			setSnackbarMessage(validationError);  // 设置错误消息
			setSnackbarSeverity('error');  // 设置错误类型
			setOpenSnackbar(true); // 显示 Snackbar
			return;
		}

		try {
			// 调用后端 API 更新产品
			const response = await axios.put(`http://localhost:5005/api/product/products/${editProductId}`, productToSave);

			console.log(response.data.message); // 打印成功消息
			setSnackbarMessage('Product saved successfully!');  // 设置成功消息
			setSnackbarSeverity('success');  // 设置成功类型
			setOpenSnackbar(true); // 显示提示
			setEditProductId(null); // 退出编辑模式

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
		handleFetchProducts();
	}, []);


	return (
		<div>
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
											value={product.ProductName}
											onChange={(e) =>
												handleProductEdit(product.ProductID, "ProductName", e.target.value)
											}
										/>
									) : (
										product.ProductName
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={product.ProductType}
											onChange={(e) =>
												handleProductEdit(product.ProductID, "ProductType", e.target.value)
											}
										/>
									) : (
										product.ProductType
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={product.ProductSpecifications}
											onChange={(e) =>
												handleProductEdit(product.ProductID, "ProductSpecifications", e.target.value)
											}
										/>
									) : (
										product.ProductSpecifications
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={product.ProductImage}
											onChange={(e) =>
												handleProductEdit(product.ProductID, "ProductImage", e.target.value)
											}
										/>
									) : (
										product.ProductImage
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={product.ProductPrice}
											onChange={(e) =>
												handleProductEdit(product.ProductID, "ProductPrice", e.target.value)
											}
										/>
									) : (
										product.ProductPrice
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (
										<TextField
											value={product.ProductStock}
											onChange={(e) =>
												handleProductEdit(product.ProductID, "ProductStock", e.target.value)
											}
										/>
									) : (
										product.ProductStock
									)}
								</TableCell>
								<TableCell>
									{editProductId === product.ProductID ? (

										<IconButton onClick={handleProductSave}>
											<Save />
										</IconButton>

									) : (
										<Box display="flex" alignItems="center">
											<IconButton onClick={() => setEditProductId(product.ProductID)}>
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
	const [openSnackbar, setOpenSnackbar] = useState(false); // Handle Snackbar state
	const [snackbarMessage, setSnackbarMessage] = useState(''); // 显示的提示消息
	const [snackbarSeverity, setSnackbarSeverity] = useState(''); // 控制 Snackbar 类型（成功或错误）
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