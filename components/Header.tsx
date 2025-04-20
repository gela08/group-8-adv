import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Styles from '@/styles/styles';
import { useRouter } from 'expo-router';
import { usePageNavigation } from '@/Context/CurrentPageContext';

const styles = Styles();

const Header = ({ isSidebarVisible, onToggleSidebar }) => {
    const Router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const {currentPage, setCurrentPage} = usePageNavigation();

    const handleSearch = () => {
        console.log('Search for:', searchQuery);
    };

    return (
        <View style={styles.navbar}>
            {/* Left: Hamburger */}
            {!isSidebarVisible && (
                <TouchableOpacity onPress={onToggleSidebar}>
                    <Ionicons name="menu" size={24} color="white" />
                </TouchableOpacity>
            )}

            {isSidebarVisible && <View>
                
                </View>}

            {/* Center: Blog Feed (absolute) */}
            {!isSidebarVisible && <View style={styles.navTitleContainer}>
                <TouchableOpacity onPress={() => Router.push('/home')}>
                    <Text style={styles.navTitle}>Blog Feed</Text>
                </TouchableOpacity>
            </View>}

            {/* Right: Search + Profile */}
            <View style={styles.rightIcons}>


                {currentPage === 'explore' && !isSidebarVisible && <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        style={styles.searchInput}
                        returnKeyType="search"
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <Ionicons name="search" size={20} color="gray" />
                    </TouchableOpacity>
                </View>}

                <TouchableOpacity onPress={() => Router.push('/profile')}>
                    <Ionicons name="person" size={24} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default Header;
