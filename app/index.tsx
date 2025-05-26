import { DaySelector } from "@/components/home/DaySelector";
import { ScoreDisplay } from "@/components/home/ScoreDisplay";
import { AttendanceButtonScreen } from "@/components/ui/ClaimButton";
import dayjs from "dayjs";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dates, setDates] = useState<
    { day: number; label: string; isClaimed: boolean; disabled: boolean }[]
  >([]);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/success.wav")
    );

    await sound.playAsync();
  }

  useEffect(() => {
    const today = dayjs();
    const newDates = [];

    for (let i = -4; i <= 2; i++) {
      const date = today.add(i, "day");
      newDates.push({
        day: date.date(),
        label: i === 0 ? "TODAY" : date.format("ddd").toUpperCase(),
        isClaimed: false,
        disabled: i > 0,
      });
    }

    setDates(newDates);
    setSelectedDay(today.date());
  }, []);

  const handleClaim = () => {
    if (selectedDay == null) return;

    const selectedDate = dates.find((d) => d.day === selectedDay);
    if (!selectedDate || selectedDate.disabled || selectedDate.isClaimed)
      return;

    const target = score + 10;
    playSound();

    setScore(target);
    setDates((prev) =>
      prev.map((date) =>
        date.day === selectedDay ? { ...date, isClaimed: true } : date
      )
    );

    let current = displayScore;
    const interval = setInterval(() => {
      current += 1;
      setDisplayScore(current);
      if (current >= target) clearInterval(interval);
    }, 30);
  };

  return (
    <View style={styles.container}>
      <ScoreDisplay score={displayScore} />
      <View style={styles.buttonWrapper}>
        <AttendanceButtonScreen onClaim={handleClaim} />
      </View>
      <DaySelector
        dates={dates}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
