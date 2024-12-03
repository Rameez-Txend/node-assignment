const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize the app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Path to the data file
const dataFilePath = path.join(__dirname, 'data.json');

// Read data from the JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Create a new item
app.post('/items', (req, res) => {
  const newItem = req.body;
  const data = readData();
  newItem.id = Date.now(); // Assign a unique ID (you can also use uuid)
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Read all items
app.get('/items', (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

// Read a single item by ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  const item = data.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.status(200).json(item);
});

// Update an item by ID
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const data = readData();

  const itemIndex = data.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  updatedItem.id = id; // Keep the existing ID
  data[itemIndex] = updatedItem;
  writeData(data);
  res.status(200).json(updatedItem);
});

// Delete an item by ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  const itemIndex = data.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const deletedItem = data.splice(itemIndex, 1);
  writeData(data);
  res.status(200).json(deletedItem);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
