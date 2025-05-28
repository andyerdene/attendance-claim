import dayjs from "dayjs";

export function generateDateList() {
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

  return { newDates, todayDay: today.date() };
}
