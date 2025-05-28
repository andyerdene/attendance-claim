import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export const DayItem = ({
  day,
  label,
  isSelected,
  isClaimed,
  disabled,
  onPress,
}: {
  day: number;
  label: string;
  isSelected: boolean;
  isClaimed: boolean;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.dateItem, disabled && { opacity: 0.5 }]}
  >
    <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected]}>
      {isClaimed ? (
        <Icon
          name="check"
          size={28}
          color={isSelected ? "#000" : "#fff"}
          style={styles.claimedIcon}
        />
      ) : (
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
          {day}
        </Text>
      )}
    </View>
    <Text style={[styles.dateLabel, isSelected && styles.dateLabelSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
  claimedIcon: {
    textAlign: "center",
    lineHeight: 40,
  },
});
