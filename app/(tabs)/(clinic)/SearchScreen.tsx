import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Search for:', searchQuery);
    // You might want to filter clinics or navigate to a results page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Clinics</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter clinic name or location"
        value={searchQuery}
        onChangeText={setSearchQuery} // Update state with input value
      />
      
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
});

export default SearchScreen;