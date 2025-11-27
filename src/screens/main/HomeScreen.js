import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../context/AuthContext';
import {useCart} from '../../context/CartContext';

const HomeScreen = ({navigation}) => {
  const {userData} = useAuth();
  const {getCartItemCount} = useCart();

  const menuItems = [
    {
      title: 'New Order',
      icon: 'plus-circle',
      color: '#1B5E20',
      description: 'Start a new drink order',
      action: () => navigation.navigate('Orders', {screen: 'MemberLookup'}),
    },
    {
      title: 'Current Cart',
      icon: 'cart',
      color: '#F57C00',
      description: `${getCartItemCount()} items in cart`,
      action: () => navigation.navigate('Orders', {screen: 'Cart'}),
    },
  ];

  if (userData?.role === 'manager') {
    menuItems.push({
      title: 'Reports',
      icon: 'chart-bar',
      color: '#1976D2',
      description: 'View sales reports',
      action: () => navigation.navigate('Reports'),
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>Welcome, {userData?.name}!</Title>
        <Paragraph style={styles.headerSubtitle}>
          {userData?.role === 'manager' ? 'Manager' : 'Bartender'}
        </Paragraph>
      </Surface>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {menuItems.map((item, index) => (
          <Card key={index} style={styles.card} onPress={item.action}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={40} color={item.color} />
              </View>
              <View style={styles.textContainer}>
                <Title style={styles.cardTitle}>{item.title}</Title>
                <Paragraph style={styles.cardDescription}>
                  {item.description}
                </Paragraph>
              </View>
              <Icon name="chevron-right" size={24} color="#757575" />
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Quick Tips</Title>
            <View style={styles.tipRow}>
              <Icon name="information" size={20} color="#1976D2" />
              <Text style={styles.tipText}>
                Member IDs are always 4 digits
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="information" size={20} color="#1976D2" />
              <Text style={styles.tipText}>
                You can add custom drinks to any order
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="information" size={20} color="#1976D2" />
              <Text style={styles.tipText}>
                Orders are automatically saved to member accounts
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    backgroundColor: '#1B5E20',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#757575',
  },
  infoCard: {
    marginTop: 16,
    backgroundColor: '#E3F2FD',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1976D2',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
});

export default HomeScreen;
