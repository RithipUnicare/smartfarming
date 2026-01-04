import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Card, Text, FAB, Chip, ActivityIndicator } from 'react-native-paper';
import { CropService } from '../../services/cropService';
import { Crop } from '../../types/crop.types';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const MyCropsScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 2 : 1;

  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const data = await CropService.getMyCrops();
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCrops();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#4CAF50';
      case 'PENDING':
        return '#FF9800';
      case 'REJECTED':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const renderCropCard = ({ item }: { item: Crop }) => (
    <Card
      style={[styles.cropCard, numColumns === 2 && styles.cropCardGrid]}
      onPress={() => navigation.navigate('CropDetail', { cropId: item.id })}
    >
      {item.imageUrl && (
        <Card.Cover source={{ uri: item.imageUrl }} style={styles.cropImage} />
      )}
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.cropName}>
          {item.cropName}
        </Text>

        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.label}>
            Quantity:
          </Text>
          <Text variant="bodyMedium" style={styles.value}>
            {item.quantity} kg
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.label}>
            Price:
          </Text>
          <Text variant="bodyMedium" style={[styles.value, styles.price]}>
            {formatCurrency(item.pricePerUnit)}/kg
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyMedium" style={styles.label}>
            Harvest:
          </Text>
          <Text variant="bodyMedium" style={styles.value}>
            {formatDate(item.harvestDate)}
          </Text>
        </View>

        <Chip
          mode="flat"
          style={[
            styles.statusChip,
            { backgroundColor: getStatusColor(item.status) },
          ]}
          textStyle={styles.statusText}
        >
          {item.status}
        </Chip>
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
        renderItem={renderCropCard}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No crops yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Tap the + button to add your first crop
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddCrop')}
        label="Add Crop"
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
    padding: 12,
    paddingBottom: 80,
  },
  cropCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cropCardGrid: {
    flex: 1,
    margin: 6,
  },
  cropImage: {
    height: 160,
  },
  cardContent: {
    paddingTop: 12,
  },
  cropName: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4CAF50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  price: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4CAF50',
  },
});
