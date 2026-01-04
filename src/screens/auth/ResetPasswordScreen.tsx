import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { AuthService } from '../../services/authService';
import {
  validatePassword,
  validatePasswordMatch,
} from '../../utils/validation';

export const ResetPasswordScreen = ({ navigation, route }: any) => {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    token: '',
    password: '',
    confirmPassword: '',
  });

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { token: '', password: '', confirmPassword: '' };

    if (!resetToken.trim()) {
      newErrors.token = 'Reset token is required';
      valid = false;
    }

    if (!validatePassword(newPassword)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!validatePasswordMatch(newPassword, confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await AuthService.resetPassword(resetToken, newPassword);
      Alert.alert('Success', 'Password has been reset successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Could not reset password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Reset Password
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter the reset code and your new password
      </Text>

      <TextInput
        label="Reset Token"
        mode="outlined"
        value={resetToken}
        onChangeText={setResetToken}
        error={!!errors.token}
        left={<TextInput.Icon icon="key" />}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.token}>
        {errors.token}
      </HelperText>

      <TextInput
        label="New Password"
        mode="outlined"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={!showPassword}
        error={!!errors.password}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <TextInput
        label="Confirm New Password"
        mode="outlined"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword}
        error={!!errors.confirmPassword}
        left={<TextInput.Icon icon="lock-check" />}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.confirmPassword}>
        {errors.confirmPassword}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Reset Password
      </Button>

      <Button mode="text" onPress={() => navigation.navigate('Login')}>
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
