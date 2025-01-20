import React from 'react';
import { registerRootComponent } from 'expo'; // Ensures compatibility with Expo Go
import { StyleSheet, View, StatusBar } from 'react-native';
import RFIDReader from './RFIDReader'; // Import the RFIDReader component

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <RFIDReader />
    </View>
  );
};

// Styles for the root container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Register the main App component as the root component
registerRootComponent(App);

export default App;
