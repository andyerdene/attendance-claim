import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (!Device.isDevice) {
    alert("Push notifications only work on physical devices.");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permission for push notifications not granted!");
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    console.warn("Project ID not found in app.json");
    return;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  return token;
}

export function setupNotificationListeners() {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("🔔 Notification received in foreground:", notification);
      const title = notification.request.content.title || "Notification";
      const body = notification.request.content.body || "";
      Alert.alert(title, body); // 👈 add this to visually show it
    }
  );

  const tapSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("📲 User tapped notification:", response);
    }
  );

  return () => {
    receivedSubscription.remove();
    tapSubscription.remove();
  };
}
