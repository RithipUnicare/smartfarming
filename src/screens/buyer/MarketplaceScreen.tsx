import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  Image,
} from 'react-native';
import {
  Card,
  Text,
  Searchbar,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { CropService } from '../../services/cropService';
import { Crop } from '../../types/crop.types';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const MarketplaceScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 3 : width > 480 ? 2 : 1;

  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCrops(crops);
    } else {
      const filtered = crops.filter(crop =>
        crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCrops(filtered);
    }
  }, [searchQuery, crops]);

  const fetchCrops = async () => {
    try {
      const data = await CropService.getApprovedCrops();
      setCrops(data);
      setFilteredCrops(data);
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

  const renderCropCard = ({ item }: { item: Crop }) => (
    <Card
      style={[styles.cropCard, numColumns > 1 && styles.cropCardGrid]}
      onPress={() => navigation.navigate('CropDetailBuyer', { crop: item })}
    >
      {item.imageUrl && (
        <Card.Cover source={{ uri: item.imageUrl }} style={styles.cropImage} />
      )}
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.cropName}>
          {item.cropName}
        </Text>

        <Text variant="bodySmall" style={styles.farmerName}>
          by {item.farmer.user.name}
        </Text>

        <View style={styles.infoRow}>
          <Chip icon="map-marker" compact style={styles.chip}>
            {item.farmer.district}, {item.farmer.state}
          </Chip>
        </View>

        <View style={styles.priceRow}>
          <Text variant="titleLarge" style={styles.price}>
            {formatCurrency(item.pricePerUnit)}/kg
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Text variant="bodySmall" style={styles.detail}>
            {item.quantity} kg available
          </Text>
          <Text variant="bodySmall" style={styles.detail}>
            {formatDate(item.harvestDate)}
          </Text>
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
      <Searchbar
        placeholder="Search crops..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredCrops}
        renderItem={renderCropCard}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No crops available
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Check back later for new listings
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  searchbar: {
    margin: 12,
    elevation: 2,
  },
  listContent: {
    padding: 12,
    paddingTop: 0,
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
    color: '#4CAF50',
    marginBottom: 4,
  },
  farmerName: {
    color: '#666',
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 8,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
  },
  priceRow: {
    marginVertical: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detail: {
    color: '#666',
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
