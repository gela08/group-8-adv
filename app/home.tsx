import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import stylesCreate from '@/styles/stylesHome';

const styles = stylesCreate();

const BlogHomeContent = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
  const [popularBlogs, setPopularBlogs] = useState<any[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const postsRef = collection(db, 'posts');

        // Featured blogs
        const featuredQuery = query(postsRef, where('featured', '==', true), limit(5));
        const featuredSnap = await getDocs(featuredQuery);
        const featured = featuredSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Popular blogs
        const popularQuery = query(postsRef, orderBy('comments', 'desc'), limit(5));
        const popularSnap = await getDocs(popularQuery);
        const popular = popularSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Latest blogs
        const latestQuery = query(postsRef, orderBy('timestamp', 'desc'), limit(5));
        const latestSnap = await getDocs(latestQuery);
        const latest = latestSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setFeaturedBlogs(featured);
        setPopularBlogs(popular);
        setLatestBlogs(latest);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6c63ff" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Featured */}
      <Text style={styles.sectionTitle}>📸 Featured</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featuredBlogs.map((blog) => (
          <TouchableOpacity key={blog.id} style={styles.featuredCard}>
            <View style={styles.featuredImageWrapper}>
              <Image source={{ uri: blog.image || 'https://via.placeholder.com/300x150.png' }} style={styles.featuredImage} />
              <Text style={styles.featuredText}>{blog.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popular Blogs */}
      <Text style={styles.sectionTitle}>🔥 Popular Blogs</Text>
      {popularBlogs.map((blog) => (
        <TouchableOpacity key={blog.id} style={styles.blogCard}>
          <Text style={styles.blogTitle}>{blog.title}</Text>
          <Text style={styles.blogSnippet}>{blog.snippet}</Text>
          <Text style={styles.blogMeta}>{blog.comments || 0} comments</Text>
        </TouchableOpacity>
      ))}

      {/* Latest Blogs */}
      <Text style={styles.sectionTitle}>🕒 Latest Posts</Text>
      {latestBlogs.map((blog) => (
        <TouchableOpacity key={blog.id} style={styles.latestCard}>
          <Text style={styles.blogTitle}>{blog.title}</Text>
          <Text style={styles.blogSnippet}>{blog.snippet}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default BlogHomeContent;
