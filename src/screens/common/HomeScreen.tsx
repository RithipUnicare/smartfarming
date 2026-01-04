import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { parseRoles, hasRole } from '../../utils/helpers';
import {
  ROLE_FARMER,
  ROLE_BUYER,
  ROLE_ADMIN,
  ROLE_SUPERADMIN,
} from '../../utils/constants';

export const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user } = useAuth();

  if (!user) return null;

  const roles = parseRoles(user.roles);

  const handleRoleSelect = (role: string) => {
    switch (role) {
      case ROLE_SUPERADMIN:
        navigation.navigate('SuperAdminTabs');
        break;
      case ROLE_FARMER:
        navigation.navigate('FarmerTabs');
        break;
      case ROLE_BUYER:
        navigation.navigate('BuyerTabs');
        break;
      case ROLE_ADMIN:
        navigation.navigate('AdminTabs');
        break;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome, {user.name}!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Select your role to continue
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        {hasRole(user.roles, ROLE_FARMER) && (
          <Card
            style={styles.roleCard}
            onPress={() => handleRoleSelect(ROLE_FARMER)}
          >
            <Card.Content style={styles.cardContent}>
              <Text variant="headlineMedium" style={styles.roleIcon}>
                🌾
              </Text>
              <Text variant="titleLarge" style={styles.roleTitle}>
                Farmer
              </Text>
              <Text variant="bodyMedium" style={styles.roleDescription}>
                Manage crops, get recommendations, track sales
              </Text>
            </Card.Content>
          </Card>
        )}

        {hasRole(user.roles, ROLE_BUYER) && (
          <Card
            style={styles.roleCard}
            onPress={() => handleRoleSelect(ROLE_BUYER)}
          >
            <Card.Content style={styles.cardContent}>
              <Text variant="headlineMedium" style={styles.roleIcon}>
                🛒
              </Text>
              <Text variant="titleLarge" style={styles.roleTitle}>
                Buyer
              </Text>
              <Text variant="bodyMedium" style={styles.roleDescription}>
                Browse marketplace, place orders, track purchases
              </Text>
            </Card.Content>
          </Card>
        )}

        {hasRole(user.roles, ROLE_ADMIN) && (
          <Card
            style={styles.roleCard}
            onPress={() => handleRoleSelect(ROLE_ADMIN)}
          >
            <Card.Content style={styles.cardContent}>
              <Text variant="headlineMedium" style={styles.roleIcon}>
                ⚙️
              </Text>
              <Text variant="titleLarge" style={styles.roleTitle}>
                Admin
              </Text>
              <Text variant="bodyMedium" style={styles.roleDescription}>
                Manage users, approve crops, system administration
              </Text>
            </Card.Content>
          </Card>
        )}

        {hasRole(user.roles, ROLE_SUPERADMIN) && (
          <Card
            style={styles.roleCard}
            onPress={() => handleRoleSelect(ROLE_SUPERADMIN)}
          >
            <Card.Content style={styles.cardContent}>
              <Text variant="headlineMedium" style={styles.roleIcon}>
                👑
              </Text>
              <Text variant="titleLarge" style={styles.roleTitle}>
                Super Admin
              </Text>
              <Text variant="bodyMedium" style={styles.roleDescription}>
                Full access to all features and system controls
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
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
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
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  roleDescription: {
    color: '#666',
    textAlign: 'center',
  },
});
