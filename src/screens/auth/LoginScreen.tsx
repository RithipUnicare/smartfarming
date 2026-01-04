import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { validateMobileNumber, validatePassword } from '../../utils/validation';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ mobile: '', password: '' });

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { mobile: '', password: '' };

    if (!validateMobileNumber(mobileNumber)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      valid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ mobileNumber, password });
      // Navigation will be handled by RootNavigator based on user role
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Smart Farming
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Empowering Communities
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Mobile Number"
            mode="outlined"
            value={mobileNumber}
            onChangeText={setMobileNumber}
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
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
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

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          >
            Login
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
          >
            Forgot Password?
          </Button>

          <View style={styles.signupContainer}>
            <Text variant="bodyMedium">Don't have an account? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Signup')}
              compact
            >
              Sign Up
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  loginButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
  forgotButton: {
    marginTop: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
