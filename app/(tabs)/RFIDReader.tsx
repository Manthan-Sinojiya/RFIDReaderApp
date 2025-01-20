import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

interface StudentDetails {
  name: string;
  enrollmentNumber: string;
  course: string;
  year: string;
  status: string;
}

const RFIDReader = () => {
  const [rfidUID, setRfidUID] = useState('');
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Fetch student details from the backend
  const fetchStudentDetails = async () => {
    if (!rfidUID) {
      Alert.alert('Error', 'Please scan an ID card.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`http://192.168.70.62:5000/student/${rfidUID}`);
      
      if (response.data) {
        setStudentDetails(response.data);
        setErrorMessage('');
      } else {
        setStudentDetails(null);
        setErrorMessage('Student not found');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setStudentDetails(null);
      setErrorMessage('Student not found or server error');
    } finally {
      setLoading(false);
      setScanning(false);
      setRfidUID('');
    }
  };

  // Handle RFID UID input
  const handleScanInput = (input: string) => {
    setRfidUID(input);
    setErrorMessage('');
  };

  // Start scanning
  const startScanning = () => {
    setScanning(true);
    setRfidUID('');
    setStudentDetails(null);
    setErrorMessage('');
  };

  // Stop scanning
  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDCARD Reader</Text>
      <Text style={styles.subtitle}>Scan ID card to fetch student details.</Text>

      {/* Display the rfidUID immediately after scan */}
      <Text style={styles.rfidDisplay}>{rfidUID ? `RFID UID: ${rfidUID}` : 'Waiting for scan...'}</Text>

      {/* Start scanning button */}
      {!scanning ? (
        <TouchableOpacity style={styles.button} onPress={startScanning}>
          <Text style={styles.buttonText}>Start Scanning</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.scanningText}>Scanning...</Text>
          <TouchableOpacity style={styles.button} onPress={stopScanning}>
            <Text style={styles.buttonText}>Stop Scanning</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Hidden input to capture the scanned RFID UID */}
      {scanning && (
        <TextInput
          style={styles.hiddenInput}
          placeholder="Scan RFID"
          value={rfidUID}
          onChangeText={handleScanInput}
          blurOnSubmit={false}
          autoFocus
        />
      )}

      {/* Fetch student details button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: rfidUID ? '#27ae60' : '#bdc3c7' }]}
        onPress={fetchStudentDetails}
        disabled={!rfidUID}
      >
        <Text style={styles.buttonText}>Fetch Details</Text>
      </TouchableOpacity>

      {/* Show loading spinner while fetching */}
      {loading && <ActivityIndicator size="large" color="#3498db" style={styles.loader} />}

      {/* Show the error message if student is not found */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Display student details */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  rfidDisplay: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  scanningText: {
    fontSize: 16,
    color: '#f39c12',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  studentDetails: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '200%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  studentHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#16a085',
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});

export default RFIDReader;
