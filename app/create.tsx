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
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

import stylesCreate from '@/styles/stylesCreate';
import { db, storage } from '@/firebase/firebase'; // 👈 Import Firebase
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const categories = ['Design', 'Product', 'Development', 'Leadership', 'Customer Support'];

const CreatePostScreen = () => {
  const styles = stylesCreate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) setImageUri(uri);
    });
  };

  const handleSubmit = async () => {
    if (!postText.trim()) {
      Alert.alert('Missing content', 'Please write something for your post.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if present
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `postImages/${uuidv4()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add post to Firestore
      await addDoc(collection(db, 'posts'), {
        text: postText,
        categories: selectedCategories,
        imageUrl,
        createdAt: Timestamp.now(),
      });

      Alert.alert('Post Created', 'Your blog post has been successfully submitted!');
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

        {/* Post & Categories */}
        <View style={styles.postCateg}>

          {/* Upload Image Button */}
          <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#007BFF" />
            <Text style={styles.imageUploadText}>Upload Image</Text>
          </TouchableOpacity>

          {/* Image Preview */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          {/* Post Input */}
          <TextInput
            placeholder="Write your post here..."
            multiline
            value={postText}
            onChangeText={setPostText}
            style={styles.textInput}
            placeholderTextColor="#999"
          />

          {/* Categories Selection */}
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
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
