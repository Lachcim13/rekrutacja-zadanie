import { Colors } from "@/constants/Colors";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { MonthDay } from "./Calendar";

export interface CalendarDayProps {
  d: MonthDay;
  width: number;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

const CalendarDay = ({
  d,
  width,
  selectedDate,
  setSelectedDate,
}: CalendarDayProps) => {
  return (
    <View
      style={{
        ...{
          width: width / 7,
          padding: 1,
        },
      }}
      key={d.date}
    >
      <Pressable
        disabled={!d.offer}
        style={{
          ...styles.touchableBox,
          ...(d.offer || !d.isCurrentMonth ? {} : styles.noOfferDay),
          ...(d.isCurrentMonth ? {} : styles.otherMonthDay),
          ...(d.today && d.isCurrentMonth ? styles.todayBackground : {}),
          ...(selectedDate === d.date ? styles.selectedDay : {}),
        }}
        onPress={() => setSelectedDate(d.date)}
      >
        <View style={styles.dayBox}>
          {d.isCurrentMonth && (
            <ThemedText
              style={{
                ...styles.dayText,
                ...(d.today
                  ? { fontWeight: "bold", color: Colors.light.primaryBlue }
                  : {}),
                ...(d.isCurrentMonth ? {} : styles.otherMonthText),
              }}
              darkColor={Colors.light.text}
            >
              {d.day}
            </ThemedText>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default CalendarDay;

const styles = StyleSheet.create({
  dayText: {
    textAlign: "center",
    fontSize: 13,
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: Colors.light.primaryBlue,
  },
  todayBackground: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.light.primaryBlue,
  },
  touchableBox: {
    backgroundColor: "#f6f6f6",
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#f6f6f6",
    justifyContent: "center",
  },
  dayBox: {
    justifyContent: "center",
    marginHorizontal: 0,
  },
  otherMonthDay: {
    backgroundColor: "#f0f0f0",
    borderColor: "#f0f0f0",
    opacity: 0.4,
  },
  noOfferDay: {
    opacity: 0.4,
  },
  otherMonthText: {
    color: "#ccc",
  },
});
