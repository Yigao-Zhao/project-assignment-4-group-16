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
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";

const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer'];

const isadmins = ['Y', 'N'];

const NAVIGATION = [
	{ id: "user-management", label: "User Management" },
	{ id: "product-management", label: "Product Management" },
];




// 模拟数据

//const mockProducts = [
//	{ ProductID: 1, ProductName: "Product A", ProductType: "Desktop", ProductSpecifications: "lenovo xxx", ProductImage: "", ProductPrice: "2999", ProductStock: "10" },
//	{ ProductID: 2, ProductName: "Product B", ProductType: "Laptop", ProductSpecifications: "dell xxx", ProductImage: "", ProductPrice: "1999", ProductStock: "20" },
//	{ ProductID: 3, ProductName: "Product C", ProductType: "Accessories", ProductSpecifications: "mouse xxx", ProductImage: "", ProductPrice: "39", ProductStock: "199" },
//];


const UserManagement = () => {


	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar 显示状态
	// 编辑状态控制
	const [editUserId, setEditUserId] = useState(null);

	const [editedUser, setEditedUser] = useState(null); // 保存正在编辑的用户数据

	// 用户编辑保存
	const handleUserEdit = (id, field, value) => {
		setUsers((prev) =>
			prev.map((user) => (user.UserID === id ? { ...user, [field]: value } : user))
		);
	};

	const handleUserSave = () => {
		//在这里可以执行保存操作，例如调用 API

		setOpenSnackbar(true); // 保存成功后显示 Snackbar
		setEditUserId(null); // 保存成功后退出编辑状态
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
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>First Name</TableCell>
						<TableCell>Middle Name</TableCell>
						<TableCell>Last Name</TableCell>
						<TableCell>Address</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Payment Method</TableCell>
						<TableCell>Is Admin</TableCell>
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
										value={user.FirstName}
										onChange={(e) =>
											handleUserEdit(user.UserID, "FirstName", e.target.value)
										}
									/>
								) : (
									user.FirstName
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.UserID ? (
									<TextField
										value={user.MiddleName}
										onChange={(e) =>
											handleUserEdit(user.UserID, "MiddleName", e.target.value)
										}
									/>
								) : (
									user.MiddleName
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.UserID ? (
									<TextField
										value={user.LastName}
										onChange={(e) =>
											handleUserEdit(user.UserID, "LastName", e.target.value)
										}
									/>
								) : (
									user.LastName
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.UserID ? (
									<TextField
										value={user.Address}
										onChange={(e) =>
											handleUserEdit(user.UserID, "Address", e.target.value)
										}
									/>
								) : (
									user.Address
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.UserID ? (
									<TextField
										value={user.Email}
										onChange={(e) =>
											handleUserEdit(user.UserID, "Email", e.target.value)
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
											value={editedUser?.PaymentMethod || user.PaymentMethod} // 临时保存选中的值
											onChange={(e) =>
												setEditedUser((prev) => ({
													...prev,
													PaymentMethod: e.target.value, // 更新临时状态
												}))
											}
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
											value={editedUser?.IsAdmin || user.IsAdmin} // 临时保存选中的值
											onChange={(e) =>
												setEditedUser((prev) => ({
													...prev,
													IsAdmin: e.target.value, // 更新临时状态
												}))
											}
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
									// 如果没有编辑当前用户，显示编辑按钮
									<IconButton onClick={() => {
										setEditUserId(user.UserID);
										//setEditedUser(user); // 复制用户信息到编辑状态
									}}>
										<Edit />
									</IconButton>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}



const ProductManagement = () => {

	const [products, setProducts] = useState([]);
	const [error, setError] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar 显示状态
	const [editProductId, setEditProductId] = useState(null);
	const handleProductEdit = (id, field, value) => {
		setProducts((prev) =>
			prev.map((product) => (product.ProductID === id ? { ...product, [field]: value } : product))
		);
	};

	const handleProductSave = () => {
		// 在这里可以执行保存操作，例如调用 API
		setOpenSnackbar(true); // 保存成功后显示 Snackbar
		setEditProductId(null); // 保存成功后退出编辑状态
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
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Specifications</TableCell>
						<TableCell>Image</TableCell>
						<TableCell>Price($)</TableCell>
						<TableCell>Stock</TableCell>
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
									<IconButton onClick={() => setEditProductId(product.ProductID)}>
										<Edit />
									</IconButton>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

const AdminDashboard = () => {
	const [selectedSection, setSelectedSection] = useState('User Management');
	const [openSnackbar, setOpenSnackbar] = useState(false); // Handle Snackbar state
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

			{/* Snackbar 提示 */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}
				message="saved successfully"
			/>
		</Box>
	);
};

export default AdminDashboard;