import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Farmer screens
import { MyCropsScreen } from '../screens/farmer/MyCropsScreen';
import { AddCropScreen } from '../screens/farmer/AddCropScreen';
import { CropRecommendationScreen } from '../screens/farmer/CropRecommendationScreen';
import { FarmerProfileSetupScreen } from '../screens/farmer/FarmerProfileSetupScreen';

// Buyer screens
import { MarketplaceScreen } from '../screens/buyer/MarketplaceScreen';
import { CropDetailBuyerScreen } from '../screens/buyer/CropDetailBuyerScreen';
import { MyOrdersScreen } from '../screens/buyer/MyOrdersScreen';
import { BuyerProfileSetupScreen } from '../screens/buyer/BuyerProfileSetupScreen';

// Admin screens
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { PendingCropsScreen } from '../screens/admin/PendingCropsScreen';
import { UpdateRoleScreen } from '../screens/admin/UpdateRoleScreen';

// Common screens
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { EditProfileScreen } from '../screens/common/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CropsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="MyCrops"
      component={MyCropsScreen}
      options={{ title: 'My Crops' }}
    />
    <Stack.Screen
      name="AddCrop"
      component={AddCropScreen}
      options={{ title: 'Add Crop' }}
    />
  </Stack.Navigator>
);

const MarketStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="Marketplace"
      component={MarketplaceScreen}
      options={{ title: 'Marketplace' }}
    />
    <Stack.Screen
      name="CropDetailBuyer"
      component={CropDetailBuyerScreen}
      options={{ title: 'Crop Details' }}
    />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="MyOrders"
      component={MyOrdersScreen}
      options={{ title: 'My Orders' }}
    />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ title: 'Admin Dashboard' }}
    />
    <Stack.Screen
      name="UserManagement"
      component={UserManagementScreen}
      options={{ title: 'User Management' }}
    />
    <Stack.Screen
      name="UpdateRole"
      component={UpdateRoleScreen}
      options={{ title: 'Update Roles' }}
    />
    <Stack.Screen
      name="PendingCrops"
      component={PendingCropsScreen}
      options={{ title: 'Pending Crops' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
    <Stack.Screen
      name="FarmerProfileSetup"
      component={FarmerProfileSetupScreen}
      options={{ title: 'Farmer Profile' }}
    />
    <Stack.Screen
      name="BuyerProfileSetup"
      component={BuyerProfileSetupScreen}
      options={{ title: 'Buyer Profile' }}
    />
  </Stack.Navigator>
);

export const SuperAdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Crops':
              iconName = 'sprout';
              break;
            case 'Market':
              iconName = 'store';
              break;
            case 'Orders':
              iconName = 'cart';
              break;
            case 'Admin':
              iconName = 'shield-account';
              break;
            case 'ProfileTab':
              iconName = 'account';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen
        name="Crops"
        component={CropsStack}
        options={{ title: 'Crops' }}
      />
      <Tab.Screen
        name="Market"
        component={MarketStack}
        options={{ title: 'Market' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminStack}
        options={{ title: 'Admin' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
