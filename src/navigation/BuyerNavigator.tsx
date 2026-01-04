import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MarketplaceScreen } from '../screens/buyer/MarketplaceScreen';
import { CropDetailBuyerScreen } from '../screens/buyer/CropDetailBuyerScreen';
import { MyOrdersScreen } from '../screens/buyer/MyOrdersScreen';
import { BuyerProfileSetupScreen } from '../screens/buyer/BuyerProfileSetupScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { EditProfileScreen } from '../screens/common/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      name="BuyerProfileSetup"
      component={BuyerProfileSetupScreen}
      options={{ title: 'Buyer Profile' }}
    />
  </Stack.Navigator>
);

export const BuyerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Market') {
            iconName = 'store';
          } else if (route.name === 'Orders') {
            iconName = 'cart';
          } else if (route.name === 'ProfileTab') {
            iconName = 'account';
          } else {
            iconName = 'circle';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Market"
        component={MarketStack}
        options={{ title: 'Marketplace' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
