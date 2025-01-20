const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // To manage environment variables securely

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URI; // Store this in .env file
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('Error connecting to MongoDB Atlas:', err));

// Define the Student model
const studentSchema = new mongoose.Schema({
  rfidUID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  enrollmentNumber: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
  status: {
    type: String,
    enum: ['Current Student', 'Passing Student', 'Alumni', 'Dropped Student'],
    required: true,
  },
});
const Student = mongoose.model('Student', studentSchema);

// API endpoint to fetch student details by RFID UID
app.get('/student/:rfidUID', async (req, res) => {
  const { rfidUID } = req.params;
  try {
    const student = await Student.findOne({ rfidUID });  // Use rfidUID to search
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.json(student);
  } catch (error) {
    res.status(500).send('Error fetching student details');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
