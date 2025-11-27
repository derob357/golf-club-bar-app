import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Card,
  Title,
  List,
  Switch,
  Button,
  Divider,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../context/AuthContext';
import {useSettings} from '../../context/SettingsContext';

const SettingsScreen = ({navigation}) => {
  const {userData, signOut} = useAuth();
  const {settings, updateSetting} = useSettings();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Profile */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Icon name="account-circle" size={60} color="#1B5E20" />
            <View style={styles.profileInfo}>
              <Title>{userData?.name}</Title>
              <Text style={styles.roleText}>
                {userData?.role === 'manager' ? 'Manager' : 'Bartender'}
              </Text>
              <Text style={styles.emailText}>{userData?.email}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Preferences</Title>

          <List.Item
            title="Notifications"
            description="Receive app notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={value =>
                  updateSetting('notificationsEnabled', value)
                }
              />
            )}
          />

          <Divider />

          <List.Item
            title="Sound Effects"
            description="Play sounds for actions"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.soundEnabled}
                onValueChange={value => updateSetting('soundEnabled', value)}
              />
            )}
          />

          <Divider />

          <List.Item
            title="Tax Rate"
            description={`Current: ${(settings.taxRate * 100).toFixed(0)}%`}
            left={props => <List.Icon {...props} icon="percent" />}
            onPress={() =>
              Alert.alert(
                'Tax Rate',
                'Contact administrator to change tax rate',
              )
            }
          />
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>

          <List.Item
            title="View Order History"
            left={props => <List.Icon {...props} icon="history" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Order history feature')}
          />

          <Divider />

          <List.Item
            title="Member Management"
            left={props => <List.Icon {...props} icon="account-group" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert('Coming Soon', 'Member management feature')
            }
          />

          {userData?.role === 'manager' && (
            <>
              <Divider />
              <List.Item
                title="User Management"
                description="Manage bartenders and staff"
                left={props => <List.Icon {...props} icon="account-cog" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  Alert.alert('Coming Soon', 'User management feature')
                }
              />
            </>
          )}
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About</Title>
          <Text style={styles.aboutText}>
            Golf Club Bar Management System
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            A comprehensive solution for tracking golf club membership drink
            purchases
          </Text>
        </Card.Content>
      </Card>

      {/* Sign Out */}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor="#D32F2F"
        icon="logout">
        Sign Out
      </Button>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  roleText: {
    fontSize: 14,
    color: '#1B5E20',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 14,
    color: '#757575',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  signOutButton: {
    margin: 16,
    borderColor: '#D32F2F',
  },
  bottomPadding: {
    height: 40,
  },
});

export default SettingsScreen;
