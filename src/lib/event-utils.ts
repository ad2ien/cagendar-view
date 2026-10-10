const ZERO_TIME = "00:00:00";
const ZERO_TIME_2 = "1:00:00 AM";

export function isZeroTime(date: Date): boolean {
  return (
    date == null || date.toTimeString().indexOf(ZERO_TIME) > -1 || date.toLocaleTimeString().indexOf(ZERO_TIME_2) > -1
  );
}

export const durationInDays = (start: Date, end: Date): number => {
  if (!start || !end) return 0;
  try {
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error("durationInDays() error", start, end, error);
    return 0;
  }
};

export const safeTruncate = (str: string | null | undefined, maxLength: number): string => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
};

export const htmlToText = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};
