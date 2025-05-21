import stylesCreate from '@/styles/stylesProfile';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { auth, db } from '@/firebase/firebase'; 
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Post } from '@/firebase/crud/crud'; 
import { onSnapshot } from 'firebase/firestore'; 
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
    
        setEmail(user.email || '');
    
        const fetchProfile = async () => {
            try {
                // Fetch user profile
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username || '');
                    setFullName(userData.fullName || '');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
    
        fetchProfile();
    
        // Fetch user posts and listen for updates
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userPosts: Post[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Post));
    
            setPosts(userPosts);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching posts:', error);
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);

    const styles = stylesCreate();

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.myPostsContainer}>
                <Text style={styles.title}>My Posts</Text>

                {posts.length > 0 ? (
                    <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.postItem}
                            onPress={() => {
                                // Navigate to dynamic read page with post ID
                                router.push(`/read/${item.id}`);
                            }}
                        >
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <Text style={styles.postDate}>
                                {item.createdAt?.toDate().toLocaleDateString() ?? 'Unknown Date'}
                            </Text>
                            <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
                                {item.comments ? `${item.comments.length} Comments` : '0 Comments'}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                ) : (
                    <Text style={styles.noPostsText}>You have no posts yet.</Text>
                )}
            </View>

            <View style={styles.profContainer}>
                <Text style={styles.title}>Profile Settings</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} value={fullName} editable={false} />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput style={styles.input} value={username} editable={false} />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Username</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} editable={false} />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Email</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} value={'********'} secureTextEntry editable={false} />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
