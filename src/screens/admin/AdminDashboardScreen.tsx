import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserService } from '../../services/userService';
import { CropService } from '../../services/cropService';
import { OrderService } from '../../services/orderService';

export const AdminDashboardScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    pendingCrops: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const users = await UserService.getAllUsers();
      const crops = await CropService.getMyCrops(); // This should be getAllCrops in real implementation
      const pendingCrops = crops.filter(crop => crop.status === 'PENDING');

      const farmers = users.filter(u => u.roles?.includes('FARMER'));
      const buyers = users.filter(u => u.roles?.includes('BUYER') || !u.roles);

      setStats({
        totalUsers: users.length,
        totalFarmers: farmers.length,
        totalBuyers: buyers.length,
        pendingCrops: pendingCrops.length,
        totalOrders: 0, // Would need admin endpoint
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = [
    styles.container,
    isTablet && { paddingHorizontal: '15%' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    //@ts-ignore
    <ScrollView style={containerStyle}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Admin Dashboard
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          System Overview
        </Text>

        <View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="account-group"
                size={48}
                color="#4CAF50"
              />
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats.totalUsers}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Users
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="sprout" size={48} color="#8BC34A" />
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats.totalFarmers}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Farmers
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="cart" size={48} color="#FFC107" />
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats.totalBuyers}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Buyers
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="clock-alert"
                size={48}
                color="#FF9800"
              />
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats.pendingCrops}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Pending Crops
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.actionsTitle}>
              Quick Actions
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('UserManagement')}
            >
              <MaterialCommunityIcons
                name="account-cog"
                size={24}
                color="#4CAF50"
              />
              <Text variant="bodyLarge" style={styles.actionText}>
                Manage Users
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#999"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('PendingCrops')}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#4CAF50"
              />
              <Text variant="bodyLarge" style={styles.actionText}>
                Approve Crops ({stats.pendingCrops})
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
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
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  statsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    color: '#666',
  },
  actionsCard: {
    marginTop: 8,
  },
  actionsTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    flex: 1,
    marginLeft: 16,
    color: '#333',
  },
});
