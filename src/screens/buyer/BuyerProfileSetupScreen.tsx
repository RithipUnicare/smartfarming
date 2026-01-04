import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { BuyerService } from '../../services/buyerService';

export const BuyerProfileSetupScreen = ({ navigation }: any) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    setLoading(true);
    try {
      await BuyerService.saveBuyerProfile({ address });
      Alert.alert('Success', 'Buyer profile saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Could not save profile',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Buyer Profile Setup
        </Text>

        <TextInput
          label="Delivery Address"
          mode="outlined"
          value={address}
          onChangeText={text => {
            setAddress(text);
            setError('');
          }}
          multiline
          numberOfLines={4}
          error={!!error}
          style={styles.input}
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Save Profile
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
