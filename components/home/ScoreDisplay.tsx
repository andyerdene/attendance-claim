import { StyleSheet, Text, View } from "react-native";

export const ScoreDisplay = ({ score }: { score: number }) => (
  <View style={styles.scoreBox}>
    <Text style={styles.scoreText}>{score}</Text>
  </View>
);

const styles = StyleSheet.create({
  scoreBox: {
    position: "absolute",
    top: 100,
    right: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#222",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fff",
    opacity: 0.5,
    zIndex: 1,
  },
  scoreText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
