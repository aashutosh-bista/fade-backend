export const SLOT_CONFIG = {
  openHour: 10,
  closeHour: 18,
  slotMinutes: 60,
  maxDaysAhead: 7,
};

// Slot start times in Nepal time, e.g. ["10:00", "11:00", ...]
export const generateSlotTimes = (): string[] => {
  const { openHour, closeHour, slotMinutes } = SLOT_CONFIG;
  const times: string[] = [];
  for (let m = openHour * 60; m + slotMinutes <= closeHour * 60; m += slotMinutes) {
    times.push(
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
    );
  }
  return times;
};