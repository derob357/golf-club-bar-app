import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Card,
  Title,
  Button,
  Text,
  TextInput,
  Surface,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../../context/CartContext';
import {useAuth} from '../../context/AuthContext';
import FirebaseService from '../../services/FirebaseService';

const CheckoutScreen = ({navigation}) => {
  const {
    cartItems,
    currentMember,
    eventName,
    setEventName,
    clearCart,
    getCartTotal,
    getTaxAmount,
    getGrandTotal,
  } = useCart();

  const {userData} = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteOrder = async () => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      // Validate required data
      if (!currentMember || !currentMember.memberId) {
        throw new Error('Member information is missing');
      }
      if (!userData || !userData.uid) {
        throw new Error('Bartender information is missing');
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const memberName = `${currentMember.firstName || ''} ${currentMember.lastName || ''}`.trim() || 'Unknown';
      const bartenderName = userData.name || 'Unknown';

      // Validate and sanitize cart items
      const validatedItems = cartItems.map(item => {
        if (!item || !item.id || !item.name) {
          throw new Error('Invalid item in cart');
        }
        return {
          itemId: item.id,
          name: item.name,
          category: item.category || 'custom',
          brand: item.brand || '',
          price: typeof item.price === 'number' ? item.price : 0,
          quantity: typeof item.quantity === 'number' ? item.quantity : 1,
        };
      });

      const orderData = {
        memberId: currentMember.memberId,
        memberName: memberName,
        bartenderId: userData.uid,
        bartenderName: bartenderName,
        items: validatedItems,
        subtotal: getCartTotal(),
        tax: getTaxAmount(),
        total: getGrandTotal(),
        eventName: (eventName || '').trim(),
        notes: (notes || '').trim(),
      };

      const orderId = await FirebaseService.createOrder(orderData);

      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Update item popularity for recommendations (non-critical, don't fail order)
      try {
        for (const item of cartItems) {
          if (item && item.id && !String(item.id).startsWith('custom_')) {
            await FirebaseService.updateItemPopularity(item.id).catch(err => {
              console.error('Failed to update item popularity:', err);
            });
          }
        }
      } catch (popularityError) {
        console.error('Error updating popularities:', popularityError);
      }

      Alert.alert(
        'Success!',
        `Order completed for ${memberName}`,
        [
          {
            text: 'OK',
            onPress: () => {
              try {
                clearCart();
                navigation.navigate('Home');
              } catch (navError) {
                console.error('Navigation error:', navError);
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error completing order:', error);
      const errorMessage = error?.message || 'Failed to complete order. Please try again.';
      Alert.alert(
        'Error',
        errorMessage,
        [{text: 'OK'}],
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentMember || cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="alert-circle" size={80} color="#D32F2F" />
        <Title style={styles.emptyTitle}>Cannot Complete Order</Title>
        <Text style={styles.emptyText}>
          {!currentMember ? 'Please select a member first' : 'Please add items to your cart first'}
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate(currentMember ? 'DrinkMenu' : 'MemberLookup')}
          style={styles.button}>
          {currentMember ? 'Browse Drinks' : 'Select Member'}
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Icon name="check-circle-outline" size={60} color="#1B5E20" />
          <Title style={styles.title}>Review Order</Title>
        </View>

        {/* Member Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardLabel}>Customer</Text>
            <Text style={styles.memberName}>
              {currentMember?.firstName || ''} {currentMember?.lastName || 'Unknown'}
            </Text>
            <Text style={styles.memberId}>
              Member ID: {currentMember?.memberId || 'N/A'}
            </Text>
          </Card.Content>
        </Card>

        {/* Bartender Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardLabel}>Bartender</Text>
            <Text style={styles.bartenderName}>{userData?.name || 'Unknown'}</Text>
          </Card.Content>
        </Card>

        {/* Order Items */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardLabel}>Order Items</Text>
            {cartItems.map((item, index) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>
                    {item.quantity}x {item.name}
                  </Text>
                  {item.brand && (
                    <Text style={styles.orderItemBrand}>{item.brand}</Text>
                  )}
                </View>
                <Text style={styles.orderItemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Order Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardLabel}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${getCartTotal().toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%):</Text>
              <Text style={styles.summaryValue}>
                ${getTaxAmount().toFixed(2)}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                ${getGrandTotal().toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Optional Fields */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardLabel}>Additional Information</Text>

            <TextInput
              label="Event Name (Optional)"
              value={eventName}
              onChangeText={setEventName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Tournament, Member Night"
              left={<TextInput.Icon icon="calendar-star" />}
            />

            <TextInput
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Any special notes for this order"
              left={<TextInput.Icon icon="note-text" />}
            />
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
            disabled={loading}>
            Back to Cart
          </Button>

          <Button
            mode="contained"
            onPress={handleCompleteOrder}
            style={styles.actionButton}
            loading={loading}
            disabled={loading}
            icon="check">
            Complete Order
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  surface: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  memberId: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  bartenderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  orderItemBrand: {
    fontSize: 14,
    color: '#757575',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  divider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  input: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
  },
});

export default CheckoutScreen;
