import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {
  Card,
  Text,
  TextInput,
  Button,
  Divider,
  HelperText,
} from 'react-native-paper';
import { Crop } from '../../types/crop.types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { OrderService } from '../../services/orderService';

export const CropDetailBuyerScreen = ({ route, navigation }: any) => {
  const { crop }: { crop: Crop } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = quantity
    ? (parseFloat(quantity) * crop.pricePerUnit).toFixed(2)
    : '0.00';

  const handlePlaceOrder = async () => {
    const qty = parseFloat(quantity);

    if (!quantity || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (qty > crop.quantity) {
      setError(`Maximum available: ${crop.quantity} kg`);
      return;
    }

    setLoading(true);
    try {
      await OrderService.placeOrder({
        cropId: crop.id,
        quantity: qty,
      });
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'View Orders', onPress: () => navigation.navigate('MyOrders') },
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Could not place order',
      );
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = [
    styles.container,
    isTablet && { alignItems: 'center' },
  ];

  return (
    //@ts-ignore
    <ScrollView style={containerStyle}>
      <View
        style={[styles.content, isTablet && { width: '70%', maxWidth: 600 }]}
      >
        {crop.imageUrl && (
          <Image
            source={{ uri: crop.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.cropName}>
              {crop.cropName}
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Farmer:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {crop.farmer.user.name}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Location:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {crop.farmer.district}, {crop.farmer.state}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Soil Type:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {crop.farmer.soilType}
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Harvest Date:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {formatDate(crop.harvestDate)}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.priceContainer}>
              <Text variant="bodyLarge" style={styles.label}>
                Price per kg:
              </Text>
              <Text variant="headlineSmall" style={styles.price}>
                {formatCurrency(crop.pricePerUnit)}
              </Text>
            </View>

            <Text variant="bodyMedium" style={styles.available}>
              Available: {crop.quantity} kg
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.orderTitle}>
              Place Order
            </Text>

            <TextInput
              label="Quantity (kg)"
              mode="outlined"
              value={quantity}
              onChangeText={text => {
                setQuantity(text);
                setError('');
              }}
              keyboardType="decimal-pad"
              error={!!error}
              style={styles.input}
            />
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>

            <View style={styles.totalContainer}>
              <Text variant="titleLarge" style={styles.totalLabel}>
                Total Amount:
              </Text>
              <Text variant="headlineSmall" style={styles.totalAmount}>
                ₹{totalAmount}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handlePlaceOrder}
              loading={loading}
              disabled={loading || !quantity}
              style={styles.button}
              icon="cart"
            >
              Place Order
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
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  cropName: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#666',
    fontWeight: '500',
  },
  value: {
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  available: {
    color: '#666',
    marginTop: 8,
  },
  orderTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  totalLabel: {
    color: '#333',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
});
