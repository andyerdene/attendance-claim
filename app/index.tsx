import { AttendanceButtonScreen } from "@/components/ui/ClaimButton";
import { Audio } from "expo-av";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const mockDates = [
  { day: 12, label: "SAT" },
  { day: 13, label: "SUN" },
  { day: 14, label: "MON" },
  { day: 15, label: "TUE" },
  { day: 16, label: "WED" },
  { day: 17, label: "SAT" },
  { day: 18, label: "SUN" },
  { day: 19, label: "MON" },
  { day: 20, label: "TUE" },
  { day: 21, label: "WED" },
  { day: 22, label: "THU" },
  { day: 23, label: "TODAY" },
];

export default function HomeScreen() {
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedDay, setSelectedDay] = useState(19); // e.g., today
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(require("../assets/success.wav"));
    setSound(sound);

    await sound.playAsync();
  }

  const handleClaim = () => {
    const target = score + 10;
    setScore(target);
    playSound();

    let current = displayScore;
    const interval = setInterval(() => {
      current += 1;
      setDisplayScore(current);
      if (current >= target) {
        clearInterval(interval); // ❌ This clears the interval from inside but doesn't stop `current += 1`
      }
    }, 30);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>{displayScore}</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <AttendanceButtonScreen onClaim={handleClaim} />
      </View>

      <FlatList
        data={mockDates}
        horizontal
        keyExtractor={(item) => item.day.toString()}
        showsHorizontalScrollIndicator={false} // ✅ hide scrollbar
        style={styles.dateRow}
        contentContainerStyle={styles.dateRowInner}
        renderItem={({ item }) => {
          const isSelected = item.day === selectedDay;
          return (
            <TouchableOpacity onPress={() => setSelectedDay(item.day)} style={styles.dateItem}>
              <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected]}>
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{item.day}</Text>
              </View>
              <Text style={[styles.dateLabel, isSelected && styles.dateLabelSelected]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
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
  },
  scoreText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateRow: {
    position: "absolute",
    bottom: 50,
    width: "100%",
  },
  dateRowInner: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  dateItem: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  dateCircleSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  dateText: {
    color: "#888",
    fontWeight: "bold",
  },
  dateTextSelected: {
    color: "#000",
  },
  dateLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  dateLabelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
