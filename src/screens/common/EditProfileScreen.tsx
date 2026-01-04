import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { validateMobileNumber } from '../../utils/validation';

export const EditProfileScreen = ({ navigation }: any) => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', mobile: '' });

  const validate = (): boolean => {
    let valid = true;
    const newErrors = { name: '', mobile: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!validateMobileNumber(mobileNumber)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await UserService.editUser({ name, mobileNumber });
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Edit Profile
      </Text>

      <TextInput
        label="Full Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
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

      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Update Profile
      </Button>

      <Button mode="text" onPress={() => navigation.goBack()}>
        Cancel
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    color: '#4CAF50',
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
