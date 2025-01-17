import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function RFIDReader() {
  const [rfidUID, setRfidUID] = useState(''); // Holds the scanned UID
  const [isScanning, setIsScanning] = useState(false); // Tracks scanning state
  const [statusMessage, setStatusMessage] = useState(''); // Tracks scan status
  const [studentDetails, setStudentDetails] = useState(null); // Student details

  useEffect(() => {
    if (rfidUID) {
      fetchStudentDetails(rfidUID);
    }
  }, [rfidUID]);

  const fetchStudentDetails = async (uid) => {
    try {
      // Replace localhost with your public IP or ngrok URL
      const response = await fetch(`http://172.16.108.62:5001/api/student/rfid/${uid}`);
      if (response.status === 404) {
        setStatusMessage('Student not found.');
        setStudentDetails(null);
        setIsScanning(false);  // Stop scanning on failure
        return;
      }

      const student = await response.json();
      setStudentDetails(student);
      setStatusMessage('Student details fetched successfully.');
      setIsScanning(false);  // Stop scanning once the details are fetched
    } catch (error) {
      console.error('Error fetching student details:', error);
      setStatusMessage('Failed to fetch student details.');
      setIsScanning(false);  // Stop scanning on error
    }
  };

  const startScanning = () => {
    setRfidUID('');  // Clear previous UID
    setIsScanning(true);  // Start scanning
    setStatusMessage('Scanning in progress...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RFID Reader</Text>
      <Text style={styles.instructions}>Click "Start Scanning" and scan your RFID card.</Text>

      {/* Start Scanning Button */}
      <Button
        onPress={startScanning}
        title={isScanning ? 'Scanning...' : 'Start Scanning'}
        color="#4299e1"
        disabled={isScanning}
      />

      {/* UID Input Field */}
      <TextInput
        style={styles.input}
        value={rfidUID}
        onChangeText={setRfidUID}
        placeholder="Waiting for scan..."
        editable={isScanning}
      />

      {/* Fetch Student Details Button */}
      <Button
        onPress={() => fetchStudentDetails(rfidUID)}
        title="Fetch Student Details"
        color="#3182ce"
        disabled={!rfidUID}
      />

      {/* Student Details */}
      {studentDetails && (
        <View style={styles.studentDetails}>
          <Text style={styles.studentHeader}>Student Details</Text>
          <Text style={styles.detail}><Text style={styles.label}>Name:</Text> {studentDetails.name}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Enrollment Number:</Text> {studentDetails.enrollmentNumber}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Course:</Text> {studentDetails.course}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Year:</Text> {studentDetails.year}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Status:</Text> {studentDetails.status}</Text>
        </View>
      )}

      {/* Status Message */}
      {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  studentDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    width: '100%',
  },
  studentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  status: {
    marginTop: 20,
    fontSize: 14,
    color: '#3182ce',
  },
});
