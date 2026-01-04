import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Checkbox, Button, Card, Divider } from 'react-native-paper';
import { AdminService } from '../../services/adminService';
import { User } from '../../types/user.types';
import { ROLE_FARMER, ROLE_BUYER, ROLE_ADMIN } from '../../utils/constants';

export const UpdateRoleScreen = ({ route, navigation }: any) => {
  const { user }: { user: User } = route.params;

  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles ? user.roles.split(',').map(r => r.trim()) : [ROLE_BUYER],
  );
  const [loading, setLoading] = useState(false);

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      // Don't allow removing all roles
      if (selectedRoles.length === 1) {
        Alert.alert('Error', 'User must have at least one role');
        return;
      }
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleUpdateRoles = async () => {
    setLoading(true);
    try {
      const rolesString = selectedRoles.join(',');
      await AdminService.updateRole({
        mobileNumber: user.mobileNumber,
        roles: rolesString,
      });
      Alert.alert('Success', 'User roles updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not update roles',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.userCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.userName}>
              {user.name}
            </Text>
            <Text variant="bodyMedium" style={styles.userInfo}>
              📞 {user.mobileNumber}
            </Text>
            <Text variant="bodyMedium" style={styles.userInfo}>
              ✉️ {user.email}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.rolesCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Assign Roles
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Select one or more roles for this user
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.roleOption}>
              <View style={styles.roleInfo}>
                <Text variant="bodyLarge" style={styles.roleTitle}>
                  🌾 Farmer
                </Text>
                <Text variant="bodySmall" style={styles.roleDescription}>
                  Can manage crops, get recommendations
                </Text>
              </View>
              <Checkbox
                status={
                  selectedRoles.includes(ROLE_FARMER) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleRole(ROLE_FARMER)}
                color="#4CAF50"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.roleOption}>
              <View style={styles.roleInfo}>
                <Text variant="bodyLarge" style={styles.roleTitle}>
                  🛒 Buyer
                </Text>
                <Text variant="bodySmall" style={styles.roleDescription}>
                  Can browse marketplace and place orders
                </Text>
              </View>
              <Checkbox
                status={
                  selectedRoles.includes(ROLE_BUYER) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleRole(ROLE_BUYER)}
                color="#4CAF50"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.roleOption}>
              <View style={styles.roleInfo}>
                <Text variant="bodyLarge" style={styles.roleTitle}>
                  ⚙️ Admin
                </Text>
                <Text variant="bodySmall" style={styles.roleDescription}>
                  Can manage users, approve crops
                </Text>
              </View>
              <Checkbox
                status={
                  selectedRoles.includes(ROLE_ADMIN) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleRole(ROLE_ADMIN)}
                color="#4CAF50"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.selectedRolesContainer}>
              <Text variant="bodyMedium" style={styles.selectedLabel}>
                Selected Roles:
              </Text>
              <Text variant="bodyLarge" style={styles.selectedRoles}>
                {selectedRoles.join(', ')}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleUpdateRoles}
              loading={loading}
              disabled={loading || selectedRoles.length === 0}
              style={styles.updateButton}
              icon="check"
            >
              Update Roles
            </Button>
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
  content: {
    padding: 16,
  },
  userCard: {
    marginBottom: 16,
  },
  userName: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  userInfo: {
    color: '#666',
    marginBottom: 4,
  },
  rolesCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  roleDescription: {
    color: '#666',
  },
  selectedRolesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  selectedLabel: {
    color: '#666',
    marginBottom: 4,
  },
  selectedRoles: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  updateButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
});
