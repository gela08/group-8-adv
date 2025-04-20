import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import stylesCreate from "@/styles/stylesRead";
import DropDownMenu from "@/components/dropDownMenu";
import moment from "moment";

const styles = stylesCreate();
const isOwner = true; // <-- Replace with actual logic to check ownership

export default function BlogPostScreen() {
  const [comments, setComments] = useState([
    {
      id: "1",
      name: "Alex J.",
      text: "This helped me a lot. Thanks!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      name: "Maria T.",
      text: "Great post! I’d love to see more on this topic.",
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // 26 hours ago
    },
  ]);
  const [commentText, setCommentText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: "You",
          text: commentText,
          timestamp: new Date().toISOString(),
        },
      ]);
      setCommentText("");
    }
  };

  const handleMenuToggle = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleArchive = () => {
    console.log("Archived");
    setMenuVisible(false);
  };

  const handleDelete = () => {
    console.log("Deleted");
    setMenuVisible(false);
  };

  const formatRelativeTime = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  const formatExactTime = (timestamp) => {
    return moment(timestamp).format("h:mm a, MM-DD-YY");
  };

  const isUnder24Hours = (timestamp) => {
    return moment().diff(moment(timestamp), "hours") < 24;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ position: "relative" }}>
        <View style={styles.postContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Your Long Blog Post Title Goes Here</Text>
            <TouchableOpacity style={styles.menuIcon} onPress={handleMenuToggle}>
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <DropDownMenu
            visible={menuVisible}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg",
              }}
              style={styles.image}
            />

            <View style={styles.authorContainer}>
              <Text style={styles.author}>Olivia Rhye</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Design</Text>
              </View>
            </View>
            <Text style={styles.date}>1/20/2022</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.content}>
              How do you create compelling presentations that wow your colleagues
              and impress your managers? Look no further.
            </Text>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.card}>
          <Text style={styles.commentHeader}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => {
                  if (isOwner && isUnder24Hours(item.timestamp)) {
                    Alert.alert("Exact Time", formatExactTime(item.timestamp));
                  }
                }}
              >
                <View style={styles.comment}>
                  <Text style={styles.commentAuthor}>{item.name}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>{formatRelativeTime(item.timestamp)}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Write your comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleAddComment}>
            <Text style={styles.buttonText}>Post Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
