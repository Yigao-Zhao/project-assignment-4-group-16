import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // import AuthContext
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { paymentOrder } from '../../services/orderService';

const PaymentPage = () => {
	const navigate = useNavigate();
    const location = useLocation();
    const { selectedItems } = location.state || { selectedItems: [] };
	// eslint-disable-next-line
	const { isAuthenticated, userId} = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' }); // store card info


    const TAX_RATE = 0.13; // demo tax rate 13%
    const subtotal = selectedItems.reduce((total, item) => total + item.ProductPrice * item.Quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // open payment dialog
    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    // close
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    // logic of payment
    const handlePayment = async() => {
		await paymentOrder(userId.userId, selectedItems.map((item) => item.CartItemID), cardDetails);
        handleCloseDialog(); // close
		navigate('/');
    };
	
	

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Payment Page
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* order detail */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit Price ($)</TableCell>
                            <TableCell align="right">Subtotal ($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedItems.map((item) => (
                            <TableRow key={item.CartItemID}>
                                <TableCell>{item.ProductName}</TableCell>
                                <TableCell align="right">{item.Quantity}</TableCell>
                                <TableCell align="right">{item.ProductPrice.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    {(item.ProductPrice * item.Quantity).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* total calculated */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" align="right">
                    Subtotal: ${subtotal.toFixed(2)}
                </Typography>
                <Typography variant="h6" align="right">
                    Tax (13%): ${tax.toFixed(2)}
                </Typography>
                <Typography variant="h5" align="right" color="primary" sx={{ mt: 2 }}>
                    Total: ${total.toFixed(2)}
                </Typography>
            </Box>

            {/* button for payment */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    Proceed to Payment
                </Button>
            </Box>

            {/* payment dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your card details to complete the payment.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Card Number"
                        type="text"
                        fullWidth
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Expiry Date (MM/YY)"
                        type="text"
                        fullWidth
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="CVV"
                        type="password"
                        fullWidth
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handlePayment} color="primary">
                        Pay
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PaymentPage;