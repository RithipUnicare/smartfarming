import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { FarmerService } from '../../services/farmerService';
import { STATES_LIST, SOIL_TYPES } from '../../utils/constants';

export const FarmerProfileSetupScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [formData, setFormData] = useState({
    address: '',
    state: '',
    district: '',
    landSize: '',
    soilType: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errors, setErrors] = useState({
    address: '',
    state: '',
    district: '',
    landSize: '',
    soilType: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await FarmerService.getFarmerProfile();
      setFormData({
        address: profile.address,
        state: profile.state,
        district: profile.district,
        landSize: profile.landSize.toString(),
        soilType: profile.soilType,
      });
    } catch (error) {
      console.log('No existing profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors = {
      address: '',
      state: '',
      district: '',
      landSize: '',
      soilType: '',
    };

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
      valid = false;
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
      valid = false;
    }

    if (!formData.landSize || parseFloat(formData.landSize) <= 0) {
      newErrors.landSize = 'Valid land size is required';
      valid = false;
    }

    if (!formData.soilType) {
      newErrors.soilType = 'Soil type is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await FarmerService.saveFarmerProfile({
        address: formData.address,
        state: formData.state,
        district: formData.district,
        landSize: parseFloat(formData.landSize),
        soilType: formData.soilType,
      });
      Alert.alert('Success', 'Farmer profile saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not save profile',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const containerStyle = [styles.container, isTablet && styles.containerTablet];

  const stateOptions = STATES_LIST.map(state => ({
    label: state,
    value: state,
  }));

  return (
    <ScrollView style={containerStyle}>
      <View style={[styles.formContainer, isTablet && styles.formTablet]}>
        <Text variant="headlineSmall" style={styles.title}>
          Farmer Profile Setup
        </Text>

        <TextInput
          label="Address"
          mode="outlined"
          value={formData.address}
          onChangeText={value => updateField('address', value)}
          error={!!errors.address}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.address}>
          {errors.address}
        </HelperText>

        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>State *</Text>
          <Dropdown
            style={[styles.dropdown, errors.state && styles.dropdownError]}
            data={stateOptions}
            labelField="label"
            valueField="value"
            placeholder="Select State"
            value={formData.state}
            onChange={item => updateField('state', item.value)}
            search
            searchPlaceholder="Search state..."
          />
          <HelperText type="error" visible={!!errors.state}>
            {errors.state}
          </HelperText>
        </View>

        <TextInput
          label="District"
          mode="outlined"
          value={formData.district}
          onChangeText={value => updateField('district', value)}
          error={!!errors.district}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.district}>
          {errors.district}
        </HelperText>

        <TextInput
          label="Land Size (in acres)"
          mode="outlined"
          value={formData.landSize}
          onChangeText={value => updateField('landSize', value)}
          keyboardType="decimal-pad"
          error={!!errors.landSize}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.landSize}>
          {errors.landSize}
        </HelperText>

        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Soil Type *</Text>
          <Dropdown
            style={[styles.dropdown, errors.soilType && styles.dropdownError]}
            data={SOIL_TYPES}
            labelField="label"
            valueField="value"
            placeholder="Select Soil Type"
            value={formData.soilType}
            onChange={item => updateField('soilType', item.value)}
          />
          <HelperText type="error" visible={!!errors.soilType}>
            {errors.soilType}
          </HelperText>
        </View>

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
  containerTablet: {
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
  },
  formTablet: {
    width: '70%',
    maxWidth: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdownContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdown: {
    height: 56,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownError: {
    borderColor: '#F44336',
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
