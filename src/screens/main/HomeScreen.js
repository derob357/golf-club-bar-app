import React from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
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
import {headingFont, headingFontRegular} from '../../theme/theme';

const HomeScreen = ({navigation}) => {
  const {userData} = useAuth();
  const {getCartItemCount} = useCart();

  const menuItems = [
    {
      title: 'New Order',
      icon: 'plus-circle',
      color: '#2C5F2D',
      description: 'Start a new drink order',
      action: () => navigation.navigate('Orders', {screen: 'MemberLookup'}),
    },
    {
      title: 'Current Cart',
      icon: 'cart',
      color: '#D4AF37',
      description: `${getCartItemCount()} items in cart`,
      action: () => navigation.navigate('Orders', {screen: 'Cart'}),
    },
  ];

  if (userData?.role === 'manager') {
    menuItems.push({
      title: 'Reports',
      icon: 'chart-bar',
      color: '#2C5F2D',
      description: 'View sales reports',
      action: () => navigation.navigate('Reports'),
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../../dhgc-banner.jpg')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.welcomeToText}>Welcome To</Text>
          <Text style={styles.clubName}>Druid Hills Golf Club</Text>
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>Welcome, {userData?.name}</Text>
            <Text style={styles.roleText}>
              {userData?.role === 'manager' ? 'Manager' : 'Bartender'}
            </Text>
          </View>
        </View>
      </View>

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
              <Icon name="information" size={20} color="#2C5F2D" />
              <Text style={styles.tipText}>
                Member IDs are always 4 digits
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="information" size={20} color="#2C5F2D" />
              <Text style={styles.tipText}>
                You can add custom drinks to any order
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="information" size={20} color="#2C5F2D" />
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
    backgroundColor: '#F8F9F5',
  },
  bannerContainer: {
    height: 240,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 95, 45, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeToText: {
    fontFamily: 'Crimson Text',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '300',
  },
  clubName: {
    fontFamily: 'Cormorant Infant',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  welcomeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Crimson Text',
    fontSize: 18,
    fontWeight: '600',
    color: '#2C5F2D',
  },
  roleText: {
    fontFamily: 'Crimson Text',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Cormorant Infant',
    fontSize: 22,
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
    fontFamily: 'Cormorant Infant',
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: 'Crimson Text',
    fontSize: 14,
    color: '#757575',
  },
  infoCard: {
    marginTop: 16,
    backgroundColor: '#F0F4E8',
  },
  infoTitle: {
    fontFamily: 'Cormorant Infant',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2C5F2D',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Crimson Text',
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
});

export default HomeScreen;
