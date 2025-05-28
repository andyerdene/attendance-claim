import { Logo } from "@/components/ui/Logo";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPLoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("app+clerk_test@example.mn");
  const [code, setCode] = useState("");

  const handleStartSignIn = async () => {
    if (!isLoaded) return;

    try {
      const createRes = await signIn.create({
        identifier: email,
      });

      const emailFactor = createRes.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (!emailFactor || !emailFactor.emailAddressId) {
        throw new Error("No email factor available for this user.");
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      Alert.alert("✅ Code sent", "Please check your email.");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.errors?.[0]?.message || "Failed to send verification code"
      );
    }
  };

  const handleVerifyCode = async () => {
    if (!isLoaded) return;

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        console.log("More steps required:", attempt);
      }
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        err?.errors?.[0]?.message || "Incorrect or expired code"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleStartSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Send Code</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Verification Code"
        placeholderTextColor="#888"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="number-pad"
      />
      <TouchableOpacity onPress={handleVerifyCode} style={styles.button}>
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "rgba(30,30,30,0.85)",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
