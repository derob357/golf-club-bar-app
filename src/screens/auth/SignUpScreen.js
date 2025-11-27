import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Title,
  HelperText,
  Surface,
  RadioButton,
} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';

const SignUpScreen = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'bartender',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {signUp} = useAuth();

  const handleSignUp = async () => {
    setError('');

    // Trim all inputs
    const trimmedName = (formData.name || '').trim();
    const trimmedEmail = (formData.email || '').trim();
    const trimmedPhone = (formData.phone || '').trim();
    const trimmedPassword = (formData.password || '').trim();
    const trimmedConfirm = (formData.confirmPassword || '').trim();

    // Comprehensive validation
    if (!trimmedName || trimmedName.length === 0) {
      setError('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (!trimmedEmail || trimmedEmail.length === 0) {
      setError('Please enter your email');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!trimmedPassword || trimmedPassword.length === 0) {
      setError('Please enter a password');
      return;
    }
    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (trimmedPassword !== trimmedConfirm) {
      setError('Passwords do not match');
      return;
    }

    // Phone validation (if provided)
    if (trimmedPhone && !/^[0-9+\-\(\)\s]*$/.test(trimmedPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    // Role validation
    const validRole = ['bartender', 'manager'].includes(formData.role) ? formData.role : 'bartender';

    setLoading(true);
    try {
      await signUp(trimmedEmail, trimmedPassword, {
        name: trimmedName,
        phone: trimmedPhone,
        role: validRole,
      });
    } catch (err) {
      const errorMessage = err?.message || 'Sign up failed. Please try again.';
      setError(errorMessage);
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Surface style={styles.surface}>
          <Title style={styles.title}>Create Account</Title>

          <TextInput
            label="Full Name *"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={text => setFormData({...formData, phone: text})}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
          />

          <Text style={styles.label}>Role</Text>
          <RadioButton.Group
            onValueChange={value => setFormData({...formData, role: value})}
            value={formData.role}>
            <View style={styles.radioContainer}>
              <RadioButton.Item label="Bartender" value="bartender" />
              <RadioButton.Item label="Manager" value="manager" />
            </View>
          </RadioButton.Group>

          <TextInput
            label="Password *"
            value={formData.password}
            onChangeText={text => setFormData({...formData, password: text})}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <TextInput
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={text =>
              setFormData({...formData, confirmPassword: text})
            }
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.button}>
            Create Account
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.textButton}>
            Already have an account? Sign In
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B5E20',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#212121',
  },
  radioContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  textButton: {
    marginTop: 8,
  },
});

export default SignUpScreen;
