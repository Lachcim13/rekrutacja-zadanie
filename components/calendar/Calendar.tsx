import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import CalendarDay from "./CalendarDay";

export interface WeekViewProps {
  from: Date;
  offerDays: string[];
  orderDays: string[];
}

export interface MonthDay {
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

export const DayFormat = "yyyy-MM-dd";

export default function MonthView({
  from,
  orderDays,
  offerDays,
}: WeekViewProps) {
  const [width, setWidth] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<Date>(from);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleOrder = async () => {
    if (!selectedDate) return;

    try {
      const response = await fetch("https://example.com/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (response.ok) {
        alert(`Zamówienie na ${selectedDate} zostało złożone.`);
      } else {
        alert("Wystąpił błąd podczas składania zamówienia.");
      }
    } catch (error) {
      alert("Nie udało się połączyć z serwerem.");
      console.error("Order error:", error);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const firstMonday = startOfWeek(monthStart, { weekStartsOn: 1 });
  const lastSunday = endOfWeek(monthEnd, { weekStartsOn: 1 });

  let day = firstMonday;
  const days: MonthDay[] = [];

  while (day <= lastSunday) {
    const formattedDate = format(day, DayFormat);

    days.push({
      day: format(day, "dd"),
      date: formattedDate,
      today: isSameDay(day, new Date()),
      offer: offerDays.includes(formattedDate),
      order: orderDays.includes(formattedDate),
      isCurrentMonth: isSameMonth(day, currentMonth),
    });

    day = addDays(day, 1);
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
      {/* Month navigation */}
      <ThemedView style={styles.monthHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <ThemedText>{format(currentMonth, "MMMM yyyy")}</ThemedText>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </ThemedView>
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
            <CalendarDay
              key={d.date}
              currentMonth={currentMonth}
              d={d}
              width={width}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          ))}
        </View>
      ))}
      {selectedDate && (
        <View style={styles.selectionFooter}>
          <ThemedText style={styles.selectedDateText}>
            Wybrana data: {selectedDate}
          </ThemedText>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => handleOrder()}
          >
            <ThemedText style={styles.orderButtonText}>Zamów</ThemedText>
          </TouchableOpacity>
        </View>
      )}
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
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  navButton: {
    fontSize: 24,
    color: blue,
    paddingHorizontal: 12,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
  selectionFooter: {
    marginTop: 12,
    alignItems: "center",
  },
  selectedDateText: {
    marginBottom: 8,
  },
  orderButton: {
    backgroundColor: orange,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
