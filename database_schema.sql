
-- Table: user
CREATE TABLE user (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    MiddleName VARCHAR(50),
    LastName VARCHAR(50),
    Address VARCHAR(255),
    Email VARCHAR(100),
    MyPassword VARCHAR(255), 
    PaymentMethod VARCHAR(50),
    IsAdmin VARCHAR(50)
);

-- Table: order
CREATE TABLE `order` (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Subtotal FLOAT,
    TaxRate FLOAT,
    Total FLOAT,
    OrderStatus VARCHAR(50),
    PaymentMethod VARCHAR(50),
    OrderDate DATE
);

-- Table: product
CREATE TABLE product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100),
    ProductType VARCHAR(50),
    ProductSpecifications TEXT,
    ProductImage LONGTEXT,
    ProductPrice FLOAT,
    ProductStock INT
);

-- Table: order_item
CREATE TABLE order_item (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    OrderProductID INT,
    OrderProductQuantity INT,
    OrderProductSoldPrice FLOAT
);

CREATE TABLE Cart (
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL
);

CREATE TABLE Cart_Item (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY, 
    CartID INT NOT NULL,                 
    CartProductID INT NOT NULL,                
    Quantity INT NOT NULL DEFAULT 1,      
    
);


-- Insert sample data into user table
INSERT INTO user (FirstName, MiddleName, LastName, Address, Email, Password, PaymentMethod, IsAdmin)
VALUES
('John', 'A', 'Doe', '123 Main St', 'john.doe@example.com', 'password123', 'Credit Card', 'Y'),
('Jane', NULL, 'Smith', '456 Maple Ave', 'jane.smith@example.com', 'securepassword', 'PayPal', 'N'),
('Alice', 'B', 'Johnson', '789 Oak Dr', 'alice.johnson@example.com', 'mypassword', 'Debit Card', 'N');
-- Insert sample data into order table
INSERT INTO `order` (UserID, Subtotal, TaxRate, Total, OrderStatus, PaymentMethod, OrderDate)
VALUES
(1, 100.00, 0.07, 107.00, 'Finished', 'Credit Card', '2024-11-01'),
(2, 50.00, 0.05, 52.50, 'Ongoing', 'PayPal', '2024-11-10'),
(3, 25.00, 0.10, 27.50, 'Cancel', 'Debit Card', '2024-11-12');

-- Insert sample data into product table
INSERT INTO product (ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock)
VALUES
('Laptop', 'Electronics', 'Intel i7, 16GB RAM, 512GB SSD', 'image1.jpg', 1200.00, 10),
('Headphones', 'Accessories', 'Noise Cancelling, Wireless', 'image2.jpg', 200.00, 50),
('Mouse', 'Accessories', 'Wireless, Ergonomic', 'image3.jpg', 30.00, 100);

-- Insert sample data into order_item table
INSERT INTO order_item (OrderID, OrderProductID, OrderProductQuantity, OrderProductSoldPrice)
VALUES
(1, 1, 1, 1200.00),
(2, 2, 2, 400.00),
(3, 3, 1, 30.00);
