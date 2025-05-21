// read.tsx

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '@/firebase/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import DropDownMenu from '@/components/dropDownMenu';
import stylesCreate from '@/styles/stylesRead';
import { deletePost, updatePost } from '@/firebase/crud/crud';

const styles = stylesCreate();

type Comment = {
  id?: string;
  content: string;
  postId: string;
  userId: string;
  username: string;
  timestamp: any;
};

export default function BlogPostScreen() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const user = auth.currentUser;
  const router = useRouter();

  // Fetch the blog post
  const fetchPost = async () => {
    if (!postId) return;
    try {
      const postDoc = await getDoc(doc(db, 'posts', String(postId)));
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    if (!postId) return;
    try {
      const q = query(collection(db, 'comments'), where('postId', '==', postId));
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      // Sort comments newest first
      fetchedComments.sort((a, b) => {
        const aTime = a.timestamp?.toDate?.() || new Date(0);
        const bTime = b.timestamp?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });

      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      console.log('User not logged in');
      return;
    }

    if (!commentText.trim()) {
      console.log('Comment cannot be empty');
      return;
    }

    const newComment: Comment = {
      content: commentText.trim(),
      postId: String(postId),
      userId: user.uid,
      username: user.displayName || user.email || 'Unnamed',
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'comments'), newComment);
      setCommentText('');
      fetchComments(); // Refresh
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : timestamp;
      return moment(date).fromNow();
    } catch {
      return 'Just now';
    }
  };

  const handleEdit = async () => {
    if (!post) return;
    try {
      // Example: Append " (Edited)" to the title
      await updatePost(post.id, { title: post.title + ' (Edited)' });
      Alert.alert('Post Updated');
      fetchPost(); // Refresh
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post.id);
      Alert.alert('Post Deleted');
      router.back(); // Navigate back
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ position: 'relative' }}>
        {/* Blog Post */}
        <View style={styles.postContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{post?.title || 'Blog Title'}</Text>
            <TouchableOpacity
              style={styles.menuIcon}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <DropDownMenu
            visible={menuVisible}
            onArchive={handleEdit}
            onDelete={handleDelete}
          />

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post?.imageUri || 'https://via.placeholder.com/600x300.png' }}
              style={styles.image}
            />
          </View>

          <Text> By {post?.authorName || 'Unknown Author'}</Text>
          <Text style={styles.content}>{post?.content || 'Loading post content...'}</Text>
        </View>

        {/* Comments Section */}
        <View style={styles.card}>
          <Text style={styles.commentHeader}>Comments</Text>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id || item.content}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentAuthor}>{item.username}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
                <Text style={styles.commentTime}>{formatRelativeTime(item.timestamp)}</Text>
              </View>
            )}
          />

          {user ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Write your comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                <Text style={styles.buttonText}>Post Comment</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ padding: 10, fontStyle: 'italic' }}>
              You must be logged in to comment.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
