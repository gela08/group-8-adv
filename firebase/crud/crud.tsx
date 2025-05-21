// crud.tsx

import { db } from '@/firebase/firebase';
import {
  collection,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

export type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  userId: string;
  comments: string;
  photoUrl: string;
  imageUri: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Comment = {
  content: string;
  postId: string;
  userId: string;
  username: string;
  timestamp: any;
};

// Create or update a post
export const uploadFullPost = async (newPost: Post) => {
  try {
    const postRef = doc(db, 'posts', newPost.id);
    await setDoc(postRef, newPost);
    console.log('Post uploaded successfully!');
  } catch (error) {
    console.error('Error uploading post:', error);
  }
};

// Upload a comment
export const uploadComment = async (comment: Comment) => {
  try {
    const commentsCollection = collection(db, 'comments');
    await addDoc(commentsCollection, comment);
    console.log('Comment uploaded successfully!');
  } catch (error) {
    console.error('Error uploading comment:', error);
  }
};

// Delete a post
export const deletePost = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    console.log('Post deleted successfully!');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

// Update a post
export const updatePost = async (postId: string, updatedData: Partial<Post>) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    console.log('Post updated successfully!');
  } catch (error) {
    console.error('Error updating post:', error);
  }
};
