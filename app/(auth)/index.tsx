import { DaySelector } from "@/components/home/DaySelector";
import { ScoreDisplay } from "@/components/home/ScoreDisplay";
import { SidebarMenu } from "@/components/SidebarMenu";
import { AttendanceButtonScreen } from "@/components/ui/ClaimButton";
import { playSuccessSound } from "@/utils/audio";
import { generateDateList } from "@/utils/dates";
import {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
} from "@/utils/notifications";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dates, setDates] = useState<
    { day: number; label: string; isClaimed: boolean; disabled: boolean }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync("authToken").then((token) => {
      if (!token) {
        router.navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    const { newDates, todayDay } = generateDateList();
    setDates(newDates);
    setSelectedDay(todayDay);
  }, []);

  const handleClaim = () => {
    if (selectedDay == null) return;

    const selectedDate = dates.find((d) => d.day === selectedDay);
    if (!selectedDate || selectedDate.disabled || selectedDate.isClaimed)
      return;

    const target = score + 10;
    playSuccessSound();
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

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        if (token) {
          console.log("✅ Valid Expo Push Token:", token);
          const res = await fetch(
            "https://db-app-andyerdenes-projects.vercel.app/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            }
          );
          console.log("Token saved:", await res.json());
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message || error);
      });
    return setupNotificationListeners();
  }, []);

  return (
    <View style={styles.container}>
      <SidebarMenu />

      <ScoreDisplay score={displayScore} />
      <View style={styles.buttonWrapper}>
        <AttendanceButtonScreen
          onClaim={handleClaim}
          isClaimed={
            dates.find((d) => d.day === selectedDay)?.isClaimed ?? false
          }
        />
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
  menuIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#111",
    padding: 20,
    zIndex: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
});
