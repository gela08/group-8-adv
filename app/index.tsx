import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesCreate from '@/styles/stylesLoginIndex';

// import { useNavigation } from '@react-navigation/native'; // Uncomment if using React Navigation

const styles = stylesCreate();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // const navigation = useNavigation();

  useEffect(() => {
    if (!email) {
      setEmailError('');
    } else if (email.includes('@') && !email.endsWith('@gmail.com')) {
      setEmailError('Email must end with @gmail.com');
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (!password || password.length >= 1) {
      setPasswordError('');
    } else {
      setPasswordError('Password cannot be empty');
    }
  }, [password]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (email.includes('@') && emailError) {
      Alert.alert('Error', 'Invalid email address.');
      return;
    }

    if (passwordError) {
      Alert.alert('Error', 'Please correct the errors before logging in.');
      return;
    }

    Alert.alert(
      'Success',
      `Logged in as ${email}\nRemember Me: ${rememberMe ? 'Yes' : 'No'}`
    );
  };

  const handleForgotPassword = () => {
    // navigation.navigate('ForgotPassword');
    Alert.alert('Forgot Password', 'Redirect to forgot password screen.');
  };

  const handleGoToRegister = () => {
    // navigation.navigate('Register');
    Alert.alert('Register', 'Redirect to register screen.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email or Username</Text>
        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder="Enter your email or username"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWithIcon, { marginBottom: 10 }]}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {!!passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        {/* Remember Me */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            thumbColor={rememberMe ? '#6c63ff' : '#ccc'}
            trackColor={{ false: '#ccc', true: '#c5c3ff' }}
          />
          <Text style={{ marginLeft: 10, color: '#444' }}>Remember me</Text>
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.label, { textAlign: 'right', color: '#6c63ff' }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#444' }}>
            Don't have an account?{' '}
            <Text
              style={{ color: '#6c63ff', fontWeight: '600' }}
              onPress={handleGoToRegister}
            >
              Register
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
