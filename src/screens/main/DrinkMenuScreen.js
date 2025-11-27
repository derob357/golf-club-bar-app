import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  FAB,
  Portal,
  Text,
  TextInput,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../../context/CartContext';
import {
  TOP_COCKTAILS,
  POPULAR_BEERS,
  WINE_TYPES,
  SPIRITS,
  DRINK_CATEGORIES,
} from '../../constants/drinks';

const DrinkMenuScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDrink, setCustomDrink] = useState({
    name: '',
    brand: '',
    price: '',
  });

  const {addToCart, getCartItemCount, currentMember} = useCart();

  // Combine all drinks
  const allDrinks = useMemo(() => {
    return [
      ...TOP_COCKTAILS,
      ...POPULAR_BEERS,
      ...WINE_TYPES,
      ...SPIRITS,
    ];
  }, []);

  // Filter drinks based on search and category
  const filteredDrinks = useMemo(() => {
    let drinks = allDrinks;

    if (selectedCategory !== 'all') {
      drinks = drinks.filter(drink => drink.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      drinks = drinks.filter(
        drink =>
          drink.name.toLowerCase().includes(query) ||
          (drink.brand && drink.brand.toLowerCase().includes(query)),
      );
    }

    return drinks;
  }, [allDrinks, selectedCategory, searchQuery]);

  const handleAddToCart = drink => {
    addToCart(drink);
  };

  const handleAddCustomDrink = () => {
    try {
      // Validate name
      if (!customDrink.name || typeof customDrink.name !== 'string' || customDrink.name.trim().length === 0) {
        Alert.alert('Validation Error', 'Please enter a drink name');
        return;
      }

      // Validate price
      const priceStr = String(customDrink.price || '').trim();
      if (priceStr.length === 0) {
        Alert.alert('Validation Error', 'Please enter a price');
        return;
      }

      const price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0 || price > 10000) {
        Alert.alert('Validation Error', 'Please enter a valid price (0.01 - 10000)');
        return;
      }

      // Round to 2 decimal places
      const roundedPrice = Math.round(price * 100) / 100;

      const newDrink = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: customDrink.name.trim(),
        brand: (customDrink.brand || '').trim() || 'Custom',
        category: 'custom',
        price: roundedPrice,
      };

      addToCart(newDrink);
      setShowCustomModal(false);
      setCustomDrink({name: '', brand: '', price: ''});
    } catch (error) {
      console.error('Error adding custom drink:', error);
      Alert.alert('Error', 'Failed to add custom drink. Please try again.');
    }
  };

  const renderDrinkItem = ({item}) => {
    if (!item || typeof item !== 'object') return null;
    
    const itemName = item.name || 'Unknown';
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    
    return (
      <Card style={styles.drinkCard}>
        <Card.Content>
          <View style={styles.drinkHeader}>
            <View style={styles.drinkInfo}>
              <Title style={styles.drinkName}>{itemName}</Title>
              {item.brand && (
                <Paragraph style={styles.drinkBrand}>{item.brand}</Paragraph>
              )}
              {item.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 && (
                <Text style={styles.ingredients}>
                  {item.ingredients.filter(i => i).join(', ')}
                </Text>
              )}
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${itemPrice.toFixed(2)}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => handleAddToCart(item)}
            icon="plus"
            compact>
            Add to Cart
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderCategoryChip = category => (
    <Chip
      key={category.id}
      selected={selectedCategory === category.id}
      onPress={() => setSelectedCategory(category.id)}
      style={styles.chip}
      icon={category.icon}>
      {category.name}
    </Chip>
  );

  if (!currentMember) {
    return (
      <View style={styles.noMemberContainer}>
        <Icon name="account-alert" size={80} color="#757575" />
        <Title style={styles.noMemberTitle}>No Member Selected</Title>
        <Paragraph style={styles.noMemberText}>
          Please select a member first
        </Paragraph>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('MemberLookup')}
          style={styles.selectMemberButton}>
          Select Member
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.memberInfo}>
          Order for: {currentMember?.firstName || ''} {currentMember?.lastName || 'Unknown Member'}
        </Text>
      </Surface>

      <Searchbar
        placeholder="Search drinks..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={DRINK_CATEGORIES}
          renderItem={({item}) => renderCategoryChip(item)}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredDrinks}
        renderItem={renderDrinkItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="glass-cocktail-off" size={60} color="#757575" />
            <Text style={styles.emptyText}>No drinks found</Text>
          </View>
        }
      />

      <Portal>
        <Modal
          visible={showCustomModal}
          onDismiss={() => setShowCustomModal(false)}
          transparent>
          <View style={styles.modalContainer}>
            <Surface style={styles.modalContent}>
              <Title style={styles.modalTitle}>Add Custom Drink</Title>

              <TextInput
                label="Drink Name *"
                value={customDrink.name}
                onChangeText={text =>
                  setCustomDrink({...customDrink, name: text})
                }
                mode="outlined"
                style={styles.modalInput}
              />

              <TextInput
                label="Brand (Optional)"
                value={customDrink.brand}
                onChangeText={text =>
                  setCustomDrink({...customDrink, brand: text})
                }
                mode="outlined"
                style={styles.modalInput}
              />

              <TextInput
                label="Price *"
                value={customDrink.price}
                onChangeText={text =>
                  setCustomDrink({...customDrink, price: text})
                }
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.modalInput}
                left={<TextInput.Icon icon="currency-usd" />}
              />

              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowCustomModal(false)}
                  style={styles.modalButton}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAddCustomDrink}
                  style={styles.modalButton}
                  disabled={!customDrink.name || !customDrink.price}>
                  Add to Cart
                </Button>
              </View>
            </Surface>
          </View>
        </Modal>
      </Portal>

      <FAB.Group
        visible
        open={false}
        icon="plus"
        actions={[
          {
            icon: 'pencil',
            label: 'Custom Drink',
            onPress: () => setShowCustomModal(true),
          },
          {
            icon: 'cart',
            label: `Cart (${getCartItemCount()})`,
            onPress: () => navigation.navigate('Cart'),
          },
        ]}
        onStateChange={() => {}}
        style={styles.fab}
      />

      {getCartItemCount() > 0 && (
        <Surface style={styles.cartBanner}>
          <View style={styles.cartBannerContent}>
            <Text style={styles.cartBannerText}>
              {getCartItemCount()} items in cart
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Cart')}
              compact>
              View Cart
            </Button>
          </View>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 12,
    backgroundColor: '#FFF9C4',
    elevation: 2,
  },
  memberInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  drinkCard: {
    marginBottom: 12,
    elevation: 2,
  },
  drinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    marginBottom: 4,
  },
  drinkBrand: {
    fontSize: 14,
    color: '#757575',
  },
  ingredients: {
    fontSize: 12,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginTop: 4,
  },
  priceContainer: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
  },
  noMemberContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noMemberTitle: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  noMemberText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  selectMemberButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
  },
  cartBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  cartBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cartBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DrinkMenuScreen;
