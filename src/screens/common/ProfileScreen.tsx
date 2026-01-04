import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Divider, List, Avatar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { parseRoles } from '../../utils/helpers';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (!user) return null;

  const roles = parseRoles(user.roles);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.header}>
          <Avatar.Text
            size={80}
            label={user.name.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user.name}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Mobile Number"
            description={user.mobileNumber}
            left={props => <List.Icon {...props} icon="phone" />}
          />
          <Divider />
          <List.Item
            title="Email"
            description={user.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Roles"
            description={roles.join(', ')}
            left={props => <List.Icon {...props} icon="account-star" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProfile')}
            icon="pencil"
            style={styles.button}
          >
            Edit Profile
          </Button>

          <Button
            mode="contained"
            onPress={handleLogout}
            icon="logout"
            buttonColor="#F44336"
            style={styles.button}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#4CAF50',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  button: {
    marginTop: 12,
  },
});
