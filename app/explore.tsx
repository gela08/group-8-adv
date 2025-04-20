import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Styles from '@/styles/stylesExplore';

const styles = Styles();

const exploreTabs = [
  'Trending', 'Most Commented', 'Newest', 'Recommended',
];

const explorePosts = [
  {
    id: 'e1',
    title: 'Designing for accessibility',
    image: 'https://via.placeholder.com/300x150.png?text=Accessibility',
    snippet: 'Learn how to make your designs more inclusive and usable.',
    author: 'Sam Park',
    timestamp: new Date('2022-02-02'),
    category: 'Design',
    comments: 76,
  },
  {
    id: 'e2',
    title: 'How to lead async teams',
    image: 'https://via.placeholder.com/300x150.png?text=Async+Teams',
    snippet: 'Async doesn’t mean disconnected — lead with clarity.',
    author: 'Alex Green',
    timestamp: new Date('2022-02-01'),
    category: 'Leadership',
    comments: 54,
  },
];

const popularComments = [
  {
    id: 'c1',
    blogTitle: 'UX review presentations',
    commenter: 'Taylor Brooks',
    comment: 'This really helped me prepare for my pitch! 🎯',
  },
  {
    id: 'c2',
    blogTitle: 'Best books on scaling your startup',
    commenter: 'Jordan Lee',
    comment: '#2 on the list is a must-read 🔥',
  },
];

const ExplorePage = () => {
  const [selectedTab, setSelectedTab] = useState('Trending');
  const router = useRouter();

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

  const renderExploreItem = ({ item }) => (
    <View style={styles.blogCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.overlay}>
          <View>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.date}>{item.timestamp.toLocaleDateString()}</Text>
          </View>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.snippet}>{item.snippet}</Text>
      <Text style={styles.blogMeta}>{item.comments} comments</Text>
      <TouchableOpacity onPress={() => router.push('/read')}>
        <Text style={styles.readPost}>Read post →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPopularComments = () => (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <Text style={styles.sectionTitle}>💬 Popular Comments</Text>
      {popularComments.map((comment) => (
        <View key={comment.id} style={styles.commentCard}>
          <Text style={styles.commentBlogTitle}>{comment.blogTitle}</Text>
          <Text style={styles.commentText}>
            <Text style={styles.commenter}>{comment.commenter}:</Text> {comment.comment}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: '#f5f5f5' }}>
      {renderTabs()}

      <FlatList
        data={explorePosts}
        renderItem={renderExploreItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
      />

      {renderPopularComments()}
    </ScrollView>
  );
};

export default ExplorePage;
