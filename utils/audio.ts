import { Audio } from "expo-av";

export async function playSuccessSound() {
  const { sound } = await Audio.Sound.createAsync(
    require("../assets/success.wav")
  );
  await sound.playAsync();
}
