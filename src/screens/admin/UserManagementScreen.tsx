import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {
  Card,
  Text,
  Searchbar,
  ActivityIndicator,
  Chip,
  IconButton,
  Button,
} from 'react-native-paper';
import { UserService } from '../../services/userService';
import { User } from '../../types/user.types';

export const UserManagementScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.mobileNumber.includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(user.id);
              Alert.alert('Success', 'User deleted successfully');
              fetchUsers();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Could not delete user',
              );
            }
          },
        },
      ],
    );
  };

  const renderUser = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text variant="titleMedium" style={styles.name}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.contact}>
              📞 {item.mobileNumber}
            </Text>
            <Text variant="bodySmall" style={styles.contact}>
              ✉️ {item.email}
            </Text>
          </View>
          <IconButton
            icon="delete"
            iconColor="#F44336"
            size={24}
            onPress={() => handleDeleteUser(item)}
          />
        </View>

        <View style={styles.rolesContainer}>
          {item.roles ? (
            item.roles.split(',').map((role, index) => (
              <Chip key={index} mode="flat" style={styles.roleChip}>
                {role.trim()}
              </Chip>
            ))
          ) : (
            <Chip mode="flat" style={styles.roleChip}>
              BUYER (Default)
            </Chip>
          )}
        </View>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('UpdateRole', { user: item })}
          style={styles.updateButton}
          icon="account-edit"
        >
          Update Roles
        </Button>
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
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          isTablet && { paddingHorizontal: '15%' },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No users found
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
  searchbar: {
    margin: 12,
    elevation: 2,
  },
  listContent: {
    padding: 12,
    paddingTop: 0,
  },
  userCard: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contact: {
    color: '#666',
    marginBottom: 2,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  roleChip: {
    backgroundColor: '#E8F5E9',
  },
  updateButton: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#666',
  },
});
