import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { CropService } from '../../services/cropService';
import { STATES_LIST, SOIL_TYPES, SEASONS } from '../../utils/constants';

export const CropRecommendationScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [formData, setFormData] = useState({
    state: '',
    district: '',
    soilType: '',
    season: '',
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const stateOptions = STATES_LIST.map(state => ({
    label: state,
    value: state,
  }));

  const handleGetRecommendations = async () => {
    if (
      !formData.state ||
      !formData.district ||
      !formData.soilType ||
      !formData.season
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await CropService.getCropRecommendation(formData);
      setRecommendations(result);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not get recommendations',
      );
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = [styles.container, isTablet && styles.containerTablet];

  return (
    <ScrollView style={containerStyle}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        <Text variant="headlineSmall" style={styles.title}>
          Crop Recommendations
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Get AI-powered crop suggestions based on your location and soil
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Enter Details
            </Text>

            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>State *</Text>
              <Dropdown
                style={styles.dropdown}
                data={stateOptions}
                labelField="label"
                valueField="value"
                placeholder="Select State"
                value={formData.state}
                onChange={item =>
                  setFormData(prev => ({ ...prev, state: item.value }))
                }
                search
                searchPlaceholder="Search state..."
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>District *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.district}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, district: text }))
                }
                placeholder="Enter district"
              />
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Soil Type *</Text>
              <Dropdown
                style={styles.dropdown}
                data={SOIL_TYPES}
                labelField="label"
                valueField="value"
                placeholder="Select Soil Type"
                value={formData.soilType}
                onChange={item =>
                  setFormData(prev => ({ ...prev, soilType: item.value }))
                }
              />
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Season *</Text>
              <Dropdown
                style={styles.dropdown}
                data={SEASONS}
                labelField="label"
                valueField="value"
                placeholder="Select Season"
                value={formData.season}
                onChange={item =>
                  setFormData(prev => ({ ...prev, season: item.value }))
                }
              />
            </View>

            <Button
              mode="contained"
              onPress={handleGetRecommendations}
              loading={loading}
              disabled={loading}
              style={styles.button}
              icon="lightbulb"
            >
              Get Recommendations
            </Button>
          </Card.Content>
        </Card>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Getting recommendations...</Text>
          </View>
        )}

        {recommendations && !loading && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recommended Crops
              </Text>
              <Text variant="bodyMedium" style={styles.resultText}>
                {JSON.stringify(recommendations, null, 2)}
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerTablet: {
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  contentTablet: {
    width: '70%',
    maxWidth: 600,
  },
  title: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  dropdown: {
    height: 56,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  textInput: {
    height: 56,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  resultText: {
    color: '#333',
    fontFamily: 'monospace',
  },
});
