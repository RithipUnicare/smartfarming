import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { FarmerNavigator } from './FarmerNavigator';
import { BuyerNavigator } from './BuyerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { SuperAdminNavigator } from './SuperAdminNavigator';
import { HomeScreen } from '../screens/common/HomeScreen';
import { parseRoles, isSingleRole, getPrimaryRole } from '../utils/helpers';
import {
  ROLE_FARMER,
  ROLE_BUYER,
  ROLE_ADMIN,
  ROLE_SUPERADMIN,
} from '../utils/constants';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthNavigator />;
  }

  // Handle null/empty roles - default to BUYER
  if (!user.roles || user.roles.trim() === '') {
    return <BuyerNavigator />;
  }

  // Check if user has single role
  if (isSingleRole(user.roles)) {
    const role = getPrimaryRole(user.roles);

    if (role === ROLE_SUPERADMIN) {
      // SuperAdmin gets access to everything
      return <SuperAdminNavigator />;
    } else if (role === ROLE_FARMER) {
      return <FarmerNavigator />;
    } else if (role === ROLE_BUYER) {
      return <BuyerNavigator />;
    } else if (role === ROLE_ADMIN) {
      return <AdminNavigator />;
    }

    return <BuyerNavigator />;
  }

  // Multiple roles - show role selector
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SuperAdminTabs" component={SuperAdminNavigator} />
      <Stack.Screen name="FarmerTabs" component={FarmerNavigator} />
      <Stack.Screen name="BuyerTabs" component={BuyerNavigator} />
      <Stack.Screen name="AdminTabs" component={AdminNavigator} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
