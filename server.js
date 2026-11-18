
const express = require('express');
const http = require('http');

const app = express();
const PORT = 3001;


app.use(express.json());


let products = [
    {
        id: 1,
        name: "Laptop",
        price: 55000,
        category: "Electronics"
    },
    
];

app.get('/', (req, res) => {
    res.send("Welcome to Product Inventory Management System");
});

app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});


app.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

app.post('/api/products', (req, res) => {
    const { name, price, quantity } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
        !Number.isInteger(quantity) || quantity < 0
    ) {
        return res.status(400).json({
            message: "Enter a valid name, price and quantity"
        });
    }

    const newProduct = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name: name.trim(),
        price,
        quantity
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});


app.put('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, price, quantity } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
        !Number.isInteger(quantity) || quantity < 0
    ) {
        return res.status(400).json({
            message: "Enter valid product details"
        });
    }

    product.name = name.trim();
    product.price = price;
    product.quantity = quantity;

    res.json({
        message: "Product updated successfully",
        product
    });
});
app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(index, 1);

    res.json({
        message: "Product deleted successfully"
    });
});


const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
