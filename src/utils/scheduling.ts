import { format, getDay, getWeekOfMonth, addDays, getWeek } from "date-fns";

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface ScheduledSlot {
  platform: string;
  time: string; // HH:mm
}

export const CONTENT_SCHEDULE: Record<number, Record<DayName, ScheduledSlot[]>> = {
  1: {
    Monday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" },
      { platform: "YouTube", time: "13:30" }
    ],
    Tuesday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" },
      { platform: "TikTok", time: "18:00" }
    ],
    Wednesday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" },
      { platform: "Rumble", time: "17:00" }
    ],
    Thursday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" },
      { platform: "Website", time: "12:00" }
    ],
    Friday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" },
      { platform: "LinkedIn", time: "09:00" }
    ],
    Saturday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" }
    ],
    Sunday: [
      { platform: "Twitter", time: "09:00" }, { platform: "Twitter", time: "13:00" }, { platform: "Twitter", time: "17:00" },
      { platform: "Instagram", time: "08:00" }, { platform: "Instagram", time: "12:00" }, { platform: "Instagram", time: "20:00" }
    ]
  }
};

// Period 2, 3 and 4 are identical to Period 1 for consistent daily tracking

// Period 3 and 4 are identical to Period 1 in the image
CONTENT_SCHEDULE[2] = CONTENT_SCHEDULE[1];
CONTENT_SCHEDULE[3] = CONTENT_SCHEDULE[1];
CONTENT_SCHEDULE[4] = CONTENT_SCHEDULE[1];

export const DAYS: DayName[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getCurrentPeriod(date: Date = new Date()): number {
  const weekOfMonth = getWeekOfMonth(date);
  // Cycle between 1-4
  return ((weekOfMonth - 1) % 4) + 1;
}

export function getRecommendedSlots(platform: string, date: Date = new Date()): ScheduledSlot[] {
  const period = getCurrentPeriod(date);
  const dayIndex = getDay(date);
  const dayName = DAYS[dayIndex];

  const daySchedule = CONTENT_SCHEDULE[period][dayName] || [];
  return daySchedule.filter(s => s.platform.toLowerCase() === platform.toLowerCase());
}

export function getNextOptimalDate(platform: string, startDate: Date = new Date()): Date {
  let currentDate = startDate;

  // Look forward up to 14 days
  for (let i = 0; i < 14; i++) {
    const slots = getRecommendedSlots(platform, currentDate);
    if (slots.length > 0) {
      const [h, m] = slots[0].time.split(":").map(Number);
      const targetDate = new Date(currentDate);
      targetDate.setHours(h, m, 0, 0);

      if (targetDate > startDate) {
        return targetDate;
      }
    }
    currentDate = addDays(currentDate, 1);
  }

  return startDate;
}
