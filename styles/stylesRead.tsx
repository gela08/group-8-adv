import { StyleSheet } from "react-native";

export default function stylesCreate() {
  return StyleSheet.create({
    container: {
      padding: 16,
    },
    imageContainer: {
      marginBottom: 16,
      borderRadius: 16,
    },
    image: {
      width: "100%",
      height: 500,
      borderRadius: 16,
    },
    author: {
      color: "grey",
      fontWeight: "bold",
      fontSize: 14,
    },
    authorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    date: {
      color: "#ddd",
      fontSize: 12,
    },
    tag: {
      width: 70,
      alignSelf: 'flex-end',
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "600",
      alignSelf: 'center',
      color: 'white',
    },
    postContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 12,
      marginBottom: 10,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    menuIcon: {
      padding: 8,
    },
    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      elevation: 3,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      flex: 1,
      marginRight: 12,
    },
    content: {
      fontSize: 16,
      color: "#444",
    },
    commentHeader: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    comment: {
      backgroundColor: "#f9f9f9",
      padding: 10,
      borderRadius: 12,
      marginBottom: 8,
    },
    commentAuthor: {
      fontWeight: "600",
      fontSize: 14,
    },
    commentText: {
      fontSize: 14,
      color: "#555",
      marginBottom: 4,
    },
    commentTime: {
      fontSize: 12,
      color: "#999",
      fontStyle: "italic",
    },
    input: {
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      padding: 10,
      marginTop: 16,
      minHeight: 60,
      textAlignVertical: "top",
    },
    button: {
      marginTop: 10,
      backgroundColor: "#000",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
  });
}
