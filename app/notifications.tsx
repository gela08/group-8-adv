// screens/NotificationsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons'; // or use 'react-native-vector-icons'

const notifications = [
  {
    id: '1',
    commenter: 'JaneDoe',
    comment: 'Loved your post about remote work tips!',
    postTitle: 'Working From Home Effectively',
    time: '2 hours ago',
  },
  {
    id: '2',
    commenter: 'JohnSmith',
    comment: 'Great insights, thanks for sharing!',
    postTitle: 'Mastering Time Management',
    time: '1 day ago',
  },
  {
    id: '3',
    commenter: 'DesignGeek',
    comment: 'Your design suggestions were 🔥',
    postTitle: 'UX Principles in 2025',
    time: '3 days ago',
  },
];

export default function NotificationsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Feather name="message-circle" size={18} color="#fff" />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          <Text style={styles.bold}>{item.commenter}</Text> commented on your post{' '}
          <Text style={styles.italic}>"{item.postTitle}"</Text>
        </Text>
        <Text style={styles.comment}>{item.comment}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bell" size={24} color="#000" />
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  comment: {
    fontSize: 13,
    color: '#444',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
});
