const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect('mongodb+srv://RFID:RFID@rfidreaderapp.c4fal.mongodb.net///rfidDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Student Schema
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

// Define Student Model
const Student = mongoose.model('Student', studentSchema);

// Define Course Schema
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

// Define Course Model
const Course = mongoose.model('Course', courseSchema);

// Helper function for unified error response
const handleError = (res, message = 'Internal Server Error', statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

// API Routes
app.get('/api/student/rfid/:rfidUID', async (req, res) => {
  try {
    const { rfidUID } = req.params;
    const student = await Student.findOne({ rfidUID });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    handleError(res, 'Failed to fetch student details');
  }
});

app.get('/api/student/enrollment/:enrollmentNumber', async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;
    const student = await Student.findOne({ enrollmentNumber });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    handleError(res, 'Failed to fetch student details');
  }
});

app.get('/api/student/course/:course', async (req, res) => {
  try {
    const { course } = req.params;
    const students = await Student.find({ course });

    if (!students.length) {
      return res.status(404).json({ error: 'No students found for this course' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching course details:', error);
    handleError(res, 'Failed to fetch course details');
  }
});

app.get('/api/student/course/:course/enrollment/:enrollmentNumber', async (req, res) => {
  try {
    const { course, enrollmentNumber } = req.params;
    const student = await Student.findOne({ course, enrollmentNumber });

    if (!student) {
      return res
        .status(404)
        .json({ error: 'Student not found for the given course and enrollment number' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    handleError(res, 'Failed to fetch student details');
  }
});

// Course APIs
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    handleError(res, 'Failed to fetch courses');
  }
});

app.post('/api/course', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const newCourse = new Course({ name, description });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    handleError(res, 'Failed to create course');
  }
});

// API to add a new student
app.post('/api/student', async (req, res) => {
  try {
    const { rfidUID, name, enrollmentNumber, course, year, status } = req.body;

    if (!rfidUID || !name || !enrollmentNumber || !course || !year || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newStudent = new Student({ rfidUID, name, enrollmentNumber, course, year, status });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    handleError(res, 'Failed to add student');
  }
});

// API to update a student
app.put('/api/student/:rfidUID', async (req, res) => {
  try {
    const { rfidUID } = req.params;
    const updates = req.body;

    const student = await Student.findOneAndUpdate({ rfidUID }, updates, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    handleError(res, 'Failed to update student');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://mongodb+srv://RFID:RFID@rfidreaderapp.c4fal.mongodb.net/:${PORT}`);
});
