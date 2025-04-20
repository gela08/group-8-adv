import stylesCreate from '@/styles/stylesProfile';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const ProfileScreen = () => {
    const [username, setUsername] = useState('john_doe');
    const [email, setEmail] = useState('john@example.com');
    const [password, setPassword] = useState('********');
    const styles = stylesCreate();

    // Dummy data for "My Posts" section
    const [posts, setPosts] = useState([
        { id: '1', title: 'My First Blog Post', date: 'April 15, 2025', commentsCount: 5 },
        { id: '2', title: 'How to Cook Pasta', date: 'April 18, 2025', commentsCount: 2 },
    ]);

    return (
        <ScrollView style={styles.container}>
            {/* My Posts Section */}
            <View style={styles.myPostsContainer}>
                <Text style={styles.title}>My Posts</Text>

                {posts.length > 0 ? (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.postItem}>
                                <Text style={styles.postTitle}>{item.title}</Text>
                                <Text style={styles.postDate}>{item.date}</Text>
                                <Text style={styles.commentsCount}>
                                    {item.commentsCount} {item.commentsCount === 1 ? 'Comment' : 'Comments'}
                                </Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noPostsText}>You have no posts yet.</Text>
                )}
            </View>

            {/* Profile Settings Section */}
            <View style={styles.profContainer}>
                <Text style={styles.title}>Profile Settings</Text>

                {/* Username */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        editable={false}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Username</Text>
                    </TouchableOpacity>
                </View>

                {/* Email */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        editable={false}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Email</Text>
                    </TouchableOpacity>
                </View>

                {/* Password */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        secureTextEntry
                        editable={false}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
