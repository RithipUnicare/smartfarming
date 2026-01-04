import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  IconButton,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { CropService } from '../../services/cropService';

export const AddCropScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    pricePerUnit: '',
    harvestDate: '',
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    cropName: '',
    quantity: '',
    pricePerUnit: '',
    harvestDate: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Could not select image');
          return;
        }
        if (response.assets && response.assets[0]) {
          setImageUri(response.assets[0].uri || null);
        }
      },
    );
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors = {
      cropName: '',
      quantity: '',
      pricePerUnit: '',
      harvestDate: '',
    };

    if (!formData.cropName.trim()) {
      newErrors.cropName = 'Crop name is required';
      valid = false;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
      valid = false;
    }

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Valid price is required';
      valid = false;
    }

    if (!formData.harvestDate) {
      newErrors.harvestDate = 'Harvest date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Create crop
      const crop = await CropService.createCrop({
        cropName: formData.cropName,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        harvestDate: formData.harvestDate,
      });

      // Upload image if selected
      if (imageUri) {
        await CropService.uploadCropImage(crop.id, imageUri);
      }

      Alert.alert('Success', 'Crop added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not add crop',
      );
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = [styles.container, isTablet && styles.containerTablet];

  return (
    <ScrollView style={containerStyle}>
      <View style={[styles.formContainer, isTablet && styles.formTablet]}>
        <Text variant="headlineSmall" style={styles.title}>
          Add New Crop
        </Text>

        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <IconButton icon="camera" size={48} iconColor="#4CAF50" />
              <Text variant="bodyMedium" style={styles.imageText}>
                Tap to add crop image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          label="Crop Name"
          mode="outlined"
          value={formData.cropName}
          onChangeText={value => updateField('cropName', value)}
          error={!!errors.cropName}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.cropName}>
          {errors.cropName}
        </HelperText>

        <TextInput
          label="Quantity (in kg)"
          mode="outlined"
          value={formData.quantity}
          onChangeText={value => updateField('quantity', value)}
          keyboardType="decimal-pad"
          error={!!errors.quantity}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.quantity}>
          {errors.quantity}
        </HelperText>

        <TextInput
          label="Price per Unit (₹/kg)"
          mode="outlined"
          value={formData.pricePerUnit}
          onChangeText={value => updateField('pricePerUnit', value)}
          keyboardType="decimal-pad"
          error={!!errors.pricePerUnit}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.pricePerUnit}>
          {errors.pricePerUnit}
        </HelperText>

        <TextInput
          label="Harvest Date (YYYY-MM-DD)"
          mode="outlined"
          value={formData.harvestDate}
          onChangeText={value => updateField('harvestDate', value)}
          placeholder="2024-12-31"
          error={!!errors.harvestDate}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.harvestDate}>
          {errors.harvestDate}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Add Crop
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
  title: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  imageText: {
    color: '#666',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
