import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

// Firebase Initialization
import '@/firebase/firebase'; // Adjust the path based on your project structure

// Components & Styles
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Styles from '@/styles/styles';
import { NavigationProvider } from '@/Context/CurrentPageContext';

const styles = Styles();

export default function Layout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState('Home');

  const closeSidebar = () => setSidebarVisible(false);

  return (
    <NavigationProvider>
      <View style={{ flex: 1, position: 'relative' }}>

        {/* Sidebar and Backdrop Overlay */}
        {isSidebarVisible && (
          <>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={closeSidebar}>
              <View style={overlayStyles.backdrop} />
            </TouchableWithoutFeedback>

            {/* Sidebar */}
            <Sidebar
              isVisible={isSidebarVisible}
              selected={selectedSidebar}
              onSelect={( label : string ) => {
                if (label === 'Close Menu') {
                  closeSidebar();
                } else {
                  setSelectedSidebar(label);
                }
              }}
            />
          </>
        )}

        {/* Main Content */}
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <Header
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setSidebarVisible(!isSidebarVisible)}
          />
          <Slot />
        </View>
      </View>
    </NavigationProvider>
  );
}

const overlayStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },
});
