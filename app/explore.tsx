import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '@/firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Styles from '@/styles/stylesExplore';
import { Post, Comment } from '@/firebase/crud/crud'; // ✅ import your types



const styles = Styles();

const exploreTabs = [
  'Trending', 'Most Commented', 'Newest', 'Recommended',
];

const ExplorePage = () => {
  const [selectedTab, setSelectedTab] = useState('Trending');
  const [explorePosts, setExplorePosts] = useState<Post[]>([]);
  const [popularComments, setPopularComments] = useState<Comment[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const router = useRouter();

  const fetchExplorePosts = async () => {
    try {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);

      const postsData: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, 'id'>),
      }));

      setExplorePosts(postsData);
      setLoadingPosts(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchPopularComments = async () => {
    try {
      const commentsCollection = collection(db, 'comments');
      const commentsQuery = query(commentsCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(commentsQuery);

      const commentsData: Comment[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, 'id'>),
      }));

      setPopularComments(commentsData.slice(0, 5));
      setLoadingComments(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };


  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchExplorePosts();
      await fetchPopularComments();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
    fetchPopularComments();
  }, []);

  const renderTabs = () => (
    <View style={styles.categoryWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
        {exploreTabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={styles.categoryButtonWrapper}>
              <View style={styles.categoryInner}>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.underline} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderExploreItem = ({ item }: { item: Post }) => (
    <View style={styles.blogCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.photoUrl }} style={styles.image} />
        <View style={styles.overlay}>
          <View>
            <Text style={styles.author}>{item.authorName}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : ''}
            </Text>
          </View>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.snippet}>{item.content?.slice(0, 80)}...</Text>
      <Text style={styles.blogMeta}>{item.comments} comments</Text>
      <TouchableOpacity
        onPress={() => {
          if (!item.id) {
            console.error('Item id is missing!');
            return;
          }
          router.push({
            pathname: '/read/[id]',
            params: { id: item.id },
          } as never);
        }}
      >
        <Text style={styles.readPost}>Read post</Text>
      </TouchableOpacity>



    </View>
  );


  const renderPopularComments = () => (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <Text style={styles.sectionTitle}>💬 Popular Comments</Text>
      {loadingComments ? (
        <Text style={{ paddingVertical: 10 }}>Loading comments...</Text>
      ) : (
        popularComments.map((comment) => (
          <View key={comment.postId} style={styles.commentCard}>
            <Text style={styles.commentBlogTitle}>{comment.postId}</Text>
            <Text style={styles.commentText}>
              <Text style={styles.commenter}>{comment.username}:</Text> {comment.content}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: '#f5f5f5' }}>
      {renderTabs()}

      {loadingPosts ? (
        <Text style={{ padding: 20, textAlign: 'center' }}>Loading posts...</Text>
      ) : (
        <FlatList
          data={explorePosts}
          renderItem={renderExploreItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        />
      )}

      {renderPopularComments()}
    </ScrollView>
  );
};

export default ExplorePage;
