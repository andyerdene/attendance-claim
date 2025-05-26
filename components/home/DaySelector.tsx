import { StyleSheet, View } from "react-native";
import { DayItem } from "./DayItem";

export const DaySelector = ({
  dates,
  selectedDay,
  setSelectedDay,
}: {
  dates: {
    day: number;
    label: string;
    isClaimed: boolean;
    disabled: boolean;
  }[];
  selectedDay: number | null;
  setSelectedDay: (day: number) => void;
}) => (
  <View style={styles.dateRow}>
    <View style={styles.dateRowInner}>
      {dates.map((item) => (
        <DayItem
          key={item.day}
          day={item.day}
          label={item.label}
          isSelected={item.day === selectedDay}
          isClaimed={item.isClaimed}
          disabled={item.disabled}
          onPress={() => {
            if (!item.disabled) setSelectedDay(item.day);
          }}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  dateRow: {
    position: "absolute",
    bottom: 50,
    width: "80%",
    marginHorizontal: "10%",
  },
  dateRowInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
