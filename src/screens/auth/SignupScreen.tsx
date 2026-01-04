import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import {
  validateMobileNumber,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../../utils/validation';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export const SignupScreen = ({ navigation }: any) => {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors = {
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!validateMobileNumber(formData.mobileNumber)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
      });
      // Navigation will be handled by AuthContext after successful signup
    } catch (error: any) {
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || 'Could not create account',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Join the Smart Farming community
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            mode="outlined"
            value={formData.name}
            onChangeText={value => updateField('name', value)}
            error={!!errors.name}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

          <TextInput
            label="Mobile Number"
            mode="outlined"
            value={formData.mobileNumber}
            onChangeText={value => updateField('mobileNumber', value)}
            keyboardType="phone-pad"
            maxLength={10}
            error={!!errors.mobile}
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.mobile}>
            {errors.mobile}
          </HelperText>

          <TextInput
            label="Email"
            mode="outlined"
            value={formData.email}
            onChangeText={value => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            label="Password"
            mode="outlined"
            value={formData.password}
            onChangeText={value => updateField('password', value)}
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
            label="Confirm Password"
            mode="outlined"
            value={formData.confirmPassword}
            onChangeText={value => updateField('confirmPassword', value)}
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
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.signupButton}
          >
            Sign Up
          </Button>

          <View style={styles.loginContainer}>
            <Text variant="bodyMedium">Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              compact
            >
              Login
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 4,
  },
  signupButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
