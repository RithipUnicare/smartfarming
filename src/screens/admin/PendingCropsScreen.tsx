import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  useWindowDimensions,
  Image,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { CropService } from '../../services/cropService';
import { AdminService } from '../../services/adminService';
import { Crop } from '../../types/crop.types';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const PendingCropsScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingCrops();
  }, []);

  const fetchPendingCrops = async () => {
    try {
      const allCrops = await CropService.getMyCrops(); // Should be admin endpoint
      const pending = allCrops.filter(crop => crop.status === 'PENDING');
      setCrops(pending);
    } catch (error) {
      console.error('Error fetching pending crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCrop = async (cropId: number) => {
    Alert.alert('Approve Crop', 'Are you sure you want to approve this crop?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          setApproving(cropId);
          try {
            await AdminService.approveCrop(cropId);
            Alert.alert('Success', 'Crop approved successfully');
            fetchPendingCrops();
          } catch (error: any) {
            Alert.alert(
              'Error',
              error.response?.data?.message || 'Could not approve crop',
            );
          } finally {
            setApproving(null);
          }
        },
      },
    ]);
  };

  const renderCrop = ({ item }: { item: Crop }) => (
    <Card style={styles.cropCard}>
      {item.imageUrl && (
        <Card.Cover source={{ uri: item.imageUrl }} style={styles.cropImage} />
      )}
      <Card.Content>
        <Text variant="titleLarge" style={styles.cropName}>
          {item.cropName}
        </Text>

        <Text variant="bodyMedium" style={styles.farmerName}>
          Farmer: {item.farmer.user.name}
        </Text>
        <Text variant="bodySmall" style={styles.location}>
          📍 {item.farmer.district}, {item.farmer.state}
        </Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.label}>
              Quantity:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.quantity} kg
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.label}>
              Price:
            </Text>
            <Text variant="bodyMedium" style={[styles.value, styles.price]}>
              {formatCurrency(item.pricePerUnit)}/kg
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.label}>
              Harvest Date:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {formatDate(item.harvestDate)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.label}>
              Soil Type:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.farmer.soilType}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Chip mode="flat" style={styles.statusChip}>
            {item.status}
          </Chip>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => handleApproveCrop(item.id)}
            loading={approving === item.id}
            disabled={approving === item.id}
            icon="check-circle"
            style={styles.approveButton}
          >
            Approve
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={crops}
        renderItem={renderCrop}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          isTablet && { paddingHorizontal: '15%' },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No pending crops
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              All crops have been reviewed
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  cropCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cropImage: {
    height: 200,
  },
  cropName: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
    marginBottom: 8,
  },
  farmerName: {
    color: '#333',
    marginBottom: 4,
  },
  location: {
    color: '#666',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
    color: '#333',
  },
  price: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
  },
  buttonContainer: {
    marginTop: 16,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#999',
    textAlign: 'center',
  },
});
