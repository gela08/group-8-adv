//create.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import stylesCreate from '@/styles/stylesCreate';
import { Timestamp } from 'firebase/firestore';
import { uploadFullPost } from '@/firebase/crud/crud';
import { auth } from '@/firebase/firebase';

const categories = [
  'Food', 'Travel', 'Health', 'Fitness', 'Lifestyle', 'Fashion', 'Beauty',
  'Technology', 'Education', 'Finance', 'Parenting', 'Entertainment', 'DIY',
  'Personal Growth', 'Career', 'Home Decor', 'Relationships', 'Pets',
  'Photography', 'Books'
];

const CreatePostScreen = () => {
  const styles = stylesCreate();

  const [postTitle, setPostTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (!postTitle.trim()) {
      Alert.alert('Missing title', 'Please enter a title for your post.');
      return;
    }

    if (!postText.trim()) {
      Alert.alert('Missing content', 'Please write something for your post.');
      return;
    }

    if (!imageUri?.startsWith('http')) {
      Alert.alert('Invalid Image', 'Please enter a valid image URL.');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Not Logged In', 'Please log in to create a post.');
        return;
      }

      const newPost = {
        id: uuidv4(),
        title: postTitle.trim(),
        content: postText.trim(),
        category: selectedCategories[0] || 'Uncategorized',
        authorName: user.displayName || 'Guest User',
        userId: user.uid,
        comments: '',
        photoUrl: '',
        imageUri,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await uploadFullPost(newPost);

      Alert.alert('Post Created', 'Your blog post has been successfully submitted!');
      setPostTitle('');
      setPostText('');
      setSelectedCategories([]);
      setImageUri(null);
    } catch (error) {
      console.error('Error submitting post:', error);
      Alert.alert('Error', 'Something went wrong while submitting your post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Post</Text>
        </View>

        {/* Title Input */}
        <TextInput
          placeholder="Enter your blog post title..."
          value={postTitle}
          onChangeText={setPostTitle}
          style={styles.titleInput}
          placeholderTextColor="#999"
        />

        {/* Image URL Input */}
        <TextInput
          placeholder="Enter image URL (https://...)"
          value={imageUri || ''}
          onChangeText={setImageUri}
          style={styles.titleInput}
          placeholderTextColor="#999"
        />

        {/* Image Preview */}
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        {/* Content Input */}
        <TextInput
          placeholder="Write your post content here..."
          multiline
          value={postText}
          onChangeText={setPostText}
          style={styles.textInput}
          placeholderTextColor="#999"
        />

        {/* Categories */}
        <View style={styles.categoriesBox}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <View style={styles.categoriesBox2}>
            <View style={styles.categoriesWrap}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(category) && styles.categoryTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
