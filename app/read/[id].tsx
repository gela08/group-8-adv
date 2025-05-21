// /app/read/[id].tsx

import { useLocalSearchParams } from 'expo-router'; // for dynamic routing params
import { db } from '@/firebase/firebase'; // Firebase connection
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods to fetch data
import { useEffect, useState } from 'react'; // React hooks for state and effect
import { ScrollView, Text, ActivityIndicator } from 'react-native'; // UI components

const ReadPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); // Get the dynamic id from the URL params
  const [post, setPost] = useState<any>(null); // State to store post data
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        console.error('No id found in params!');
        return;
      }

      try {
        // Fetch post from Firestore using the dynamic id
        const docRef = doc(db, 'posts', id); // Referencing the post document using its ID
        const docSnap = await getDoc(docRef); // Fetch the document snapshot

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() }); // Set post data to state if it exists
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error); // Error handling
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchPost(); // Call the fetchPost function on component mount
  }, [id]); // Re-run the effect if id changes

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20, alignSelf: 'center' }} />;
  }

  if (!post) {
    return <Text style={{ marginTop: 20, textAlign: 'center' }}>Post not found.</Text>;
  }

  // Display the fetched post content
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{post.title}</Text>
      <Text style={{ marginVertical: 10, color: 'gray' }}>{post.authorName || 'Unknown Author'}</Text>
      <Text style={{ fontSize: 16 }}>{post.content}</Text>
    </ScrollView>
  );
};

export default ReadPage;
