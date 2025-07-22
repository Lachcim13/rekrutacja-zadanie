import moment, { Moment } from "moment";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

export interface WeekViewProps {
  from: Moment;
  offerDays: string[];
  orderDays: string[];
}

interface MonthDay {
  day: string;
  date: string;
  today: boolean;
  offer: boolean;
  order: boolean;
  isCurrentMonth: boolean;
}

// TODO: use color theme 
const blue = "#0070ff";
const lightBlue = "#4688eb";
const orange = "#ffaa2a";

export const DayFormat = "YYYY-MM-DD";

export default function MonthView({
  from,
  orderDays,
  offerDays,
}: WeekViewProps) {
  const [width, setWidth] = useState<number>(0);

  // TODO: don't use momentjs - it's obsolete - switch to other library
  const monthStart = moment(from).startOf("month");
  const monthEnd = moment(from).endOf("month");

  const firstMonday = moment(monthStart).startOf("week");
  const lastSunday = moment(monthEnd).endOf("week");

  const day = moment(firstMonday);
  const days: MonthDay[] = [];

  while (day.isSameOrBefore(lastSunday)) {
    days.push({
      day: day.format("DD"),
      date: day.format(DayFormat),
      today: day.isSame(moment(), "day"),
      offer: offerDays.includes(day.format(DayFormat)),
      order: orderDays.includes(day.format(DayFormat)),
      isCurrentMonth: day.isSame(from, "month"),
    });

    day.add(1, "day");
  }

  const weeks: MonthDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const weekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View
      style={styles.days}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/* Week day header */}
      <View style={styles.weekHeader}>
        {weekDayNames.map((dayName) => (
          <View
            key={dayName}
            style={{
              width: width / 7,
              padding: 2,
            }}
          >
            <ThemedText style={styles.weekDayName}>{dayName[0]}</ThemedText>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <View key={`week-${week[0]?.date || weekIndex}`} style={styles.weekRow}>
          {week.map((d) => (
            <View
              style={{
                ...{
                  width: width / 7,
                  padding: 1,
                },
              }}
              key={d.date}
            >

            { /* TODO: Add ability to select day, mark selected day on the calendar.
            Display day details below the calendar */}
              <Pressable
                style={{
                  ...styles.touchableBox,
                  ...(d.offer || !d.isCurrentMonth ? {} : styles.noOfferDay),
                  ...(d.isCurrentMonth ? {} : styles.otherMonthDay),
                  ...(d.today && d.isCurrentMonth
                    ? styles.todayBackground
                    : {}),
                }}
                onPress={() => {}}
              >
                <View style={styles.dayBox}>
                  {d.isCurrentMonth && (
                    <ThemedText
                      style={{
                        ...styles.dayText,
                        ...(d.today ? { fontWeight: "bold", color: blue } : {}),
                        ...(d.isCurrentMonth ? {} : styles.otherMonthText),
                      }}
                    >
                      {d.day}
                    </ThemedText>
                  )}
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    position: "absolute",
    borderRadius: 5,
    width: 15,
    aspectRatio: 1,
  },
  unavailable: {
    opacity: 0.5,
  },
  ordered: {
    top: -3,
    right: -3,
    backgroundColor: lightBlue,
  },
  orderedUnpaid: {
    top: -3,
    right: -3,
    backgroundColor: orange,
  },
  cancelled: {
    bottom: -3,
    left: -3,
    backgroundColor: "#666",
  },
  added: {
    bottom: -3,
    right: -3,
    backgroundColor: blue,
  },
  orderedText: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: "poppins-bold",
    color: "#fff",
  },
  days: {
    marginVertical: 2,
    marginHorizontal: 2,
    alignSelf: "stretch",
  },
  weekHeader: {
    flexDirection: "row",
  },
  weekRow: {
    flexDirection: "row",
  },
  dayText: {
    textAlign: "center",
    fontSize: 13,
  },
  weekDayName: {
    textAlign: "center",
    color: "#aaa",
    fontFamily: "poppins-bold",
    textTransform: "uppercase",
    fontSize: 8,
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: blue,
  },
  today: {
    color: "#555",
  },
  todayBackground: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: blue,
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
