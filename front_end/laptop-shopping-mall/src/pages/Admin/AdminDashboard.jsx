import React, { useState } from "react";
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
	InputLabel
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";

const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer'];

const AdminDashboard = () => {
	const [selectedSection, setSelectedSection] = useState("User Management");

	const NAVIGATION = [
		{ id: "user-management", label: "User Management" },
		{ id: "product-management", label: "Product Management" },
	];

	// 模拟数据
	const mockUsers = [
		{ id: 1, firstname: "John", middlename: "A", lastname: "Doe", address: "123", email: "john@example.com", paymentmethod: "Credit Card", isadmin: "Y" },
		{ id: 2, firstname: "Jo", middlename: "B", lastname: "De", address: "456", email: "jo@example.com", paymentmethod: "PayPal", isadmin: "N" },
		{ id: 3, firstname: "Jojo", middlename: "C", lastname: "Dedd", address: "789", email: "jojo@example.com", paymentmethod: "Bank Transfer", isadmin: "N" },
	];

	const mockProducts = [
		{ id: 1, name: "Product A", type: "lenovo", specifications: "desktop", image: "", price: "2999", stock: "10" },
		{ id: 2, name: "Product B", type: "apple", specifications: "laptop", image: "", price: "1999", stock: "20" },
		{ id: 3, name: "Product C", type: "Dell", specifications: "mouse", image: "", price: "39", stock: "199" },
	];

	const [users, setUsers] = useState(mockUsers);
	const [products, setProducts] = useState(mockProducts);
	const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar 显示状态


	// 编辑状态控制
	const [editUserId, setEditUserId] = useState(null);
	const [editProductId, setEditProductId] = useState(null);
	const [editedUser, setEditedUser] = useState(null); // 保存正在编辑的用户数据

	// 用户编辑保存
	const handleUserEdit = (id, field, value) => {
		setUsers((prev) =>
			prev.map((user) => (user.id === id ? { ...user, [field]: value } : user))
		);
	};

	const handleUserSave = () => {
		//在这里可以执行保存操作，例如调用 API

		setOpenSnackbar(true); // 保存成功后显示 Snackbar
		setEditUserId(null); // 保存成功后退出编辑状态
	};

	// 产品编辑保存
	const handleProductEdit = (id, field, value) => {
		setProducts((prev) =>
			prev.map((product) => (product.id === id ? { ...product, [field]: value } : product))
		);
	};

	const handleProductSave = () => {
		// 在这里可以执行保存操作，例如调用 API
		setOpenSnackbar(true); // 保存成功后显示 Snackbar
		setEditProductId(null); // 保存成功后退出编辑状态
	};

	const renderUserManagement = () => (
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
						<TableRow key={user.id}>
							<TableCell>{user.id}</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<TextField
										value={user.firstname}
										onChange={(e) =>
											handleUserEdit(user.id, "firstname", e.target.value)
										}
									/>
								) : (
									user.firstname
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<TextField
										value={user.middlename}
										onChange={(e) =>
											handleUserEdit(user.id, "middlename", e.target.value)
										}
									/>
								) : (
									user.middlename
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<TextField
										value={user.lastname}
										onChange={(e) =>
											handleUserEdit(user.id, "lastname", e.target.value)
										}
									/>
								) : (
									user.lastname
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<TextField
										value={user.address}
										onChange={(e) =>
											handleUserEdit(user.id, "address", e.target.value)
										}
									/>
								) : (
									user.address
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<TextField
										value={user.email}
										onChange={(e) =>
											handleUserEdit(user.id, "email", e.target.value)
										}
									/>
								) : (
									user.email
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<FormControl fullWidth>
										<Select
											value={editedUser?.paymentmethod || user.paymentmethod} // 临时保存选中的值
											onChange={(e) =>
												setEditedUser((prev) => ({
													...prev,
													paymentmethod: e.target.value, // 更新临时状态
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
									user.paymentmethod // 显示最终保存的支付方式
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<TextField
										value={user.isadmin}
										onChange={(e) =>
											handleUserEdit(user.id, "isadmin", e.target.value)
										}
									/>
								) : (
									user.isadmin
								)}
							</TableCell>
							<TableCell>
								{editUserId === user.id ? (
									<IconButton onClick={handleUserSave}>
										<Save />
									</IconButton>
								) : (
									// 如果没有编辑当前用户，显示编辑按钮
									<IconButton onClick={() => {
										setEditUserId(user.id);
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

	const renderProductManagement = () => (
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
						<TableRow key={product.id}>
							<TableCell>{product.id}</TableCell>
							<TableCell>
								{editProductId === product.id ? (
									<TextField
										value={product.name}
										onChange={(e) =>
											handleProductEdit(product.id, "name", e.target.value)
										}
									/>
								) : (
									product.name
								)}
							</TableCell>
							<TableCell>
								{editProductId === product.id ? (
									<TextField
										value={product.type}
										onChange={(e) =>
											handleProductEdit(product.id, "type", e.target.value)
										}
									/>
								) : (
									product.type
								)}
							</TableCell>
							<TableCell>
								{editProductId === product.id ? (
									<TextField
										value={product.specifications}
										onChange={(e) =>
											handleProductEdit(product.id, "specifications", e.target.value)
										}
									/>
								) : (
									product.specifications
								)}
							</TableCell>
							<TableCell>
								{product.image || "N/A"}
							</TableCell>
							<TableCell>
								{editProductId === product.id ? (
									<TextField
										value={product.price}
										onChange={(e) =>
											handleProductEdit(product.id, "price", e.target.value)
										}
									/>
								) : (
									product.price
								)}
							</TableCell>
							<TableCell>
								{editProductId === product.id ? (
									<TextField
										value={product.stock}
										onChange={(e) =>
											handleProductEdit(product.id, "stock", e.target.value)
										}
									/>
								) : (
									product.stock
								)}
							</TableCell>
							<TableCell>
								{editProductId === product.id ? (
									<IconButton onClick={handleProductSave}>
										<Save />
									</IconButton>
								) : (
									<IconButton onClick={() => setEditProductId(product.id)}>
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
				{selectedSection === "User Management" && renderUserManagement()}
				{selectedSection === "Product Management" && renderProductManagement()}
			</Box>

			{/* Snackbar 提示 */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}
				message="保存成功"
			/>
		</Box>
	);
};

export default AdminDashboard;