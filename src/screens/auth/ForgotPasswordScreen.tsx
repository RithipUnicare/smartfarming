import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { AuthService } from '../../services/authService';
import { validateMobileNumber } from '../../utils/validation';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await AuthService.requestPasswordReset(mobileNumber);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your mobile number',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('ResetPassword', { mobileNumber }),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Could not process request',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Forgot Password
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter your mobile number to receive reset instructions
      </Text>

      <TextInput
        label="Mobile Number"
        mode="outlined"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        maxLength={10}
        error={!!error}
        left={<TextInput.Icon icon="phone" />}
        style={styles.input}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Send Reset Code
      </Button>

      <Button mode="text" onPress={() => navigation.goBack()}>
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: 32,
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
