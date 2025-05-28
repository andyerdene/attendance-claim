import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export const SidebarMenu = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const { signOut } = useClerk();

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuOpen(false));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
    router.replace("/login");
  };
  const handleRegisterDevice = async () => {
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
  };

  return (
    <>
      <Pressable style={styles.menuIcon} onPress={openMenu}>
        <Ionicons name="menu" size={28} color="white" />
      </Pressable>
      {menuOpen && <Pressable style={styles.overlay} onPress={closeMenu} />}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <Text style={styles.menuTitle}>Menu</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRegisterDevice}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
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
