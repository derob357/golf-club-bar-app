import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Surface,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FirebaseService from '../../services/FirebaseService';
import {useCart} from '../../context/CartContext';

const MemberLookupScreen = ({navigation}) => {
  const [memberId, setMemberId] = useState('');
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lookupTimeoutRef = React.useRef(null);
  const isMountedRef = React.useRef(true);

  const {setMember: setCartMember, currentMember} = useCart();

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (lookupTimeoutRef.current) {
        clearTimeout(lookupTimeoutRef.current);
      }
    };
  }, []);

  const validateMemberId = id => {
    // Must be 4 digits
    if (!id || typeof id !== 'string') return false;
    return /^\d{4}$/.test(id.trim());
  };

  const handleLookup = async (idToLookup) => {
    const currentId = idToLookup || memberId;
    
    setError('');
    setMember(null);

    if (!validateMemberId(currentId)) {
      setError('Member ID must be exactly 4 digits');
      return;
    }

    setLoading(true);
    try {
      const memberData = await FirebaseService.getMemberById(currentId.trim());

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      if (!memberData) {
        setError('Member not found. Please check the ID and try again.');
      } else if (memberData.active === false) {
        setError('This member account is inactive.');
      } else {
        setMember(memberData);
        if (setCartMember && typeof setCartMember === 'function') {
          setCartMember(memberData);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError('Error looking up member. Please try again.');
      }
      console.error('Member lookup error:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleContinue = () => {
    if (member) {
      navigation.navigate('DrinkMenu');
    }
  };

  const handleKeyPress = () => {
    if (memberId.length === 4) {
      handleLookup();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Icon name="account-card-details" size={60} color="#1B5E20" />
          <Title style={styles.title}>Member Lookup</Title>
          <Paragraph style={styles.subtitle}>
            Enter the 4-digit member ID
          </Paragraph>
        </View>

        <TextInput
          label="Member ID"
          value={memberId}
          onChangeText={text => {
            // Only allow digits, max 4
            const cleaned = String(text || '').replace(/[^0-9]/g, '').slice(0, 4);
            setMemberId(cleaned);
            
            // Clear any existing timeout
            if (lookupTimeoutRef.current) {
              clearTimeout(lookupTimeoutRef.current);
            }
            
            // Clear previous errors
            setError('');
            setMember(null);
            
            if (cleaned.length === 4) {
              // Auto-lookup when 4 digits entered with debounce
              lookupTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                  handleLookup(cleaned);
                }
              }, 500);
            }
          }}
          mode="outlined"
          keyboardType="number-pad"
          maxLength={4}
          style={styles.input}
          error={!!error}
          disabled={loading}
          left={<TextInput.Icon icon="numeric" />}
          right={
            loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <TextInput.Icon icon="magnify" onPress={() => handleLookup(null)} />
            )
          }
        />

        {error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <View style={styles.errorContent}>
                <Icon name="alert-circle" size={24} color="#D32F2F" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card.Content>
          </Card>
        ) : null}

        {member ? (
          <Card style={styles.memberCard}>
            <Card.Content>
              <View style={styles.memberHeader}>
                <Icon name="check-circle" size={40} color="#388E3C" />
                <Title style={styles.memberTitle}>Member Found!</Title>
              </View>

              <View style={styles.memberInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>
                    {member.firstName || ''} {member.lastName || ''}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Member ID:</Text>
                  <Text style={styles.value}>{member.memberId || 'N/A'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{member.email || 'N/A'}</Text>
                </View>

                {member.phone && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{member.phone}</Text>
                  </View>
                )}

                {member.membershipType && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Membership:</Text>
                    <Text style={styles.value}>{member.membershipType}</Text>
                  </View>
                )}
              </View>

              <Button
                mode="contained"
                onPress={handleContinue}
                style={styles.continueButton}
                icon="arrow-right">
                Continue to Order
              </Button>
            </Card.Content>
          </Card>
        ) : null}

        {!member && !loading && (
          <View style={styles.instructionsCard}>
            <Icon name="information-outline" size={24} color="#1976D2" />
            <Text style={styles.instructionText}>
              Ask the member for their 4-digit ID number
            </Text>
          </View>
        )}

        {currentMember && (
          <Card style={styles.currentMemberCard}>
            <Card.Content>
              <Text style={styles.currentMemberLabel}>
                Current Order For:
              </Text>
              <Text style={styles.currentMemberName}>
                {currentMember.firstName} {currentMember.lastName} (
                {currentMember.memberId})
              </Text>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('DrinkMenu')}
                style={styles.viewOrderButton}>
                Continue Order
              </Button>
            </Card.Content>
          </Card>
        )}
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
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    fontSize: 24,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    marginBottom: 16,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: 12,
    color: '#D32F2F',
    flex: 1,
  },
  memberCard: {
    backgroundColor: '#E8F5E9',
    marginTop: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberTitle: {
    marginLeft: 12,
    color: '#388E3C',
  },
  memberInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  value: {
    fontSize: 14,
    color: '#212121',
  },
  continueButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
  },
  currentMemberCard: {
    marginTop: 24,
    backgroundColor: '#FFF9C4',
  },
  currentMemberLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  currentMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  viewOrderButton: {
    borderColor: '#F57C00',
  },
});

export default MemberLookupScreen;
