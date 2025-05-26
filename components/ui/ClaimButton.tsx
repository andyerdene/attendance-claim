import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

const HOLD_DURATION = 1500;
type Props = {
  onClaim?: () => void;
};
export function AttendanceButtonScreen({ onClaim }: Props) {
  const [showExp, setShowExp] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const expAnim = useRef(new Animated.Value(0)).current;
  const chargeAnim = useRef(new Animated.Value(0)).current;

  const triggerExpEffect = () => {
    // Pulse
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // EXP Float
    expAnim.setValue(0);
    setShowExp(true);
    Animated.timing(expAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setShowExp(false));
    chargeAnim.setValue(0);
    if (onClaim) onClaim(); // ✅ Notify parent
  };

  const handlePressIn = () => {
    // Start growing animation
    chargeAnim.setValue(0);
    Animated.timing(chargeAnim, {
      toValue: 1,
      duration: HOLD_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    Vibration.vibrate([0, 100, 100], true);
    timeoutRef.current = setTimeout(() => {
      triggerExpEffect();
      Vibration.cancel();
    }, HOLD_DURATION);
  };

  const handlePressOut = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Stop charging if released early
    chargeAnim.stopAnimation();
    Animated.timing(chargeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const chargeScale = chargeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.1],
  });

  const chargeOpacity = chargeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const expOpacity = expAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const expTranslateY = expAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <View style={styles.container}>
      {showExp && (
        <Animated.Text
          style={[
            styles.expText,
            {
              opacity: expOpacity,
              transform: [{ translateY: expTranslateY }],
            },
          ]}
        >
          +10 EXP
        </Animated.Text>
      )}

      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={[styles.circleButton, { transform: [{ scale: scaleAnim }] }]}
        >
          <Animated.View
            style={[
              styles.chargeCircle,
              {
                opacity: chargeOpacity,
                transform: [{ scale: chargeScale }],
              },
            ]}
          />
          <Text style={styles.buttonText}>ATTENDANCE</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  circleButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  chargeCircle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
    zIndex: 1,
  },
  expText: {
    position: "absolute",
    bottom: "52%",
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
});
