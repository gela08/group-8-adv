// register.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesCreate from '@/styles/stylesRegister';
import { signUp } from '@/firebase/auth/auth_register'; // adjust the path as needed
import { useRouter } from 'expo-router';



const styles = stylesCreate();

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const router = useRouter();


  const isPasswordMatch = () => {
    return password === confirmPassword;
  };

  useEffect(() => {
    if (!email || email.endsWith('@gmail.com')) {
      setEmailError('');
    } else {
      setEmailError('Email must end with @gmail.com');
    }
  }, [email]);

  useEffect(() => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_/]/.test(password);

    if (!password || (password.length >= 8 && hasNumber && hasSpecialChar)) {
      setPasswordError('');
    } else {
      setPasswordError(
        'Password must be at least 8 characters, contain a number, and a special character.'
      );
    }
  }, [password]);

  useEffect(() => {
    if (!username || username.length >= 3) {
      setUsernameError('');
    } else {
      setUsernameError('Username must be at least 3 characters');
    }
  }, [username]);

  useEffect(() => {
    if (!confirmPassword || isPasswordMatch()) {
      setPasswordMatchError('');
    } else {
      setPasswordMatchError('Passwords do not match');
    }
  }, [confirmPassword, password]);

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!isPasswordMatch()) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (emailError || passwordError || usernameError || passwordMatchError) {
      Alert.alert('Error', 'Please correct the errors before proceeding.');
      return;
    }
  
    try {
      await signUp(name, username, email, password);
      Alert.alert('Success', `Account created for ${username}!`);
      router.replace('/'); // Redirect to login
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : error.message || 'Something went wrong. Try again.';
  
      Alert.alert('Registration Failed', errorMsg);
    }
  };  

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder="Choose a username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        {!!usernameError && (
          <Text style={styles.errorText}>{usernameError}</Text>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {!!emailError && (
          <Text style={styles.errorText}>{emailError}</Text>
        )}

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

        <Text style={styles.label}>Confirm Password</Text>
        <View style={[styles.inputWithIcon, { marginBottom: 10 }]}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Confirm your password"
            placeholderTextColor="#888"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {!!passwordMatchError && (
          <Text style={styles.errorText}>{passwordMatchError}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
