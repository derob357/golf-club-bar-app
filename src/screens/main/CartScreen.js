import React from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  Card,
  Title,
  Button,
  Text,
  IconButton,
  Surface,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../../context/CartContext';

const CartScreen = ({navigation}) => {
  const {
    cartItems,
    currentMember,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTaxAmount,
    getGrandTotal,
  } = useCart();

  const handleRemoveItem = itemId => {
    Alert.alert('Remove Item', 'Remove this item from cart?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Remove', onPress: () => removeFromCart(itemId), style: 'destructive'},
    ]);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', onPress: clearCart, style: 'destructive'},
      ],
    );
  };

  const renderCartItem = ({item}) => (
    <Card style={styles.itemCard}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.brand && (
              <Text style={styles.itemBrand}>{item.brand}</Text>
            )}
            <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
          </View>

          <View style={styles.quantityControls}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            />
            <Text style={styles.quantity}>{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            />
          </View>

          <View style={styles.itemTotal}>
            <Text style={styles.totalPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
            <IconButton
              icon="delete"
              size={20}
              iconColor="#D32F2F"
              onPress={() => handleRemoveItem(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (!currentMember) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="account-alert" size={80} color="#757575" />
        <Title style={styles.emptyTitle}>No Member Selected</Title>
        <Text style={styles.emptyText}>
          Please select a member to start an order
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('MemberLookup')}
          style={styles.button}>
          Select Member
        </Button>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart-off" size={80} color="#757575" />
        <Title style={styles.emptyTitle}>Your cart is empty</Title>
        <Text style={styles.emptyText}>
          Add some drinks to get started
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('DrinkMenu')}
          style={styles.button}>
          Browse Drinks
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.memberCard}>
        <Text style={styles.memberLabel}>Order for:</Text>
        <Text style={styles.memberName}>
          {currentMember.firstName} {currentMember.lastName}
        </Text>
        <Text style={styles.memberId}>ID: {currentMember.memberId}</Text>
      </Surface>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={handleClearCart}
              style={styles.clearButton}
              textColor="#D32F2F">
              Clear Cart
            </Button>
          </View>
        }
      />

      <Surface style={styles.summaryCard}>
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

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
          icon="arrow-right">
          Proceed to Checkout
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('DrinkMenu')}
          style={styles.continueButton}>
          Add More Items
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  memberCard: {
    padding: 16,
    backgroundColor: '#FFF9C4',
    elevation: 2,
  },
  memberLabel: {
    fontSize: 12,
    color: '#757575',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  memberId: {
    fontSize: 14,
    color: '#757575',
  },
  list: {
    padding: 16,
    paddingBottom: 200,
  },
  itemCard: {
    marginBottom: 12,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  itemBrand: {
    fontSize: 14,
    color: '#757575',
  },
  itemPrice: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  footer: {
    marginTop: 16,
  },
  clearButton: {
    borderColor: '#D32F2F',
  },
  summaryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    elevation: 8,
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
  checkoutButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  continueButton: {
    marginTop: 4,
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

export default CartScreen;
