import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MyCropsScreen } from '../screens/farmer/MyCropsScreen';
import { AddCropScreen } from '../screens/farmer/AddCropScreen';
import { CropRecommendationScreen } from '../screens/farmer/CropRecommendationScreen';
import { FarmerProfileSetupScreen } from '../screens/farmer/FarmerProfileSetupScreen';
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
  </Stack.Navigator>
);

export const FarmerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Crops') {
            iconName = 'sprout';
          } else if (route.name === 'Recommendations') {
            iconName = 'lightbulb';
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
        name="Crops"
        component={CropsStack}
        options={{ title: 'My Crops' }}
      />
      <Tab.Screen
        name="Recommendations"
        component={CropRecommendationScreen}
        options={{
          title: 'Recommendations',
          headerShown: true,
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
