import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Card, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { OrderService } from '../../services/orderService';
import { Order } from '../../types/order.types';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export const MyOrdersScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      // Check if it's a buyer profile not found error
      if (err.response?.data?.error === 'Buyer profile not found') {
        setError('Please set up your buyer profile first to view orders.');
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <Card
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { order: item })}
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.cropName}>
            {item.crop.cropName}
          </Text>
          <Chip mode="flat" style={styles.statusChip}>
            {item.status}
          </Chip>
        </View>

        <Text variant="bodySmall" style={styles.farmerName}>
          Farmer: {item.crop.farmer.user.name}
        </Text>

        <View style={styles.detailsRow}>
          <Text variant="bodyMedium">
            Quantity: <Text style={styles.bold}>{item.quantity} kg</Text>
          </Text>
          <Text variant="bodyMedium" style={styles.amount}>
            {formatCurrency(item.totalAmount)}
          </Text>
        </View>

        <Text variant="bodySmall" style={styles.date}>
          {formatDateTime(item.createdAt)}
        </Text>
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

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyText}>
          ⚠️
        </Text>
        <Text variant="titleMedium" style={styles.emptyText}>
          {error}
        </Text>
        {error.includes('buyer profile') && (
          <Text
            variant="bodyMedium"
            style={styles.linkText}
            onPress={() => navigation.navigate('BuyerProfileSetup')}
          >
            Set up buyer profile
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          isTablet && styles.listTablet,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No orders yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Start shopping in the marketplace!
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
  listTablet: {
    paddingHorizontal: '15%',
  },
  orderCard: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontWeight: 'bold',
    color: '#4CAF50',
    flex: 1,
  },
  statusChip: {
    backgroundColor: '#E8F5E9',
  },
  farmerName: {
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  amount: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  date: {
    color: '#999',
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
  linkText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
