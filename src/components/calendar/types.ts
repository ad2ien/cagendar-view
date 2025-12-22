export type TCalendarView = "day" | "week" | "month" | "year" | "agenda";
export type TEventColor =
	| "blue"
	| "green"
	| "red"
	| "yellow"
	| "purple"
	| "orange";

const colors: TEventColor[] = ["blue", "green", "red", "yellow", "purple", "orange"];

const createColorGenerator = () => {
  let id = 0;
  return () => {
     const color = colors[id];
     id = (id + 1) % colors.length; // Cycle back to 0 when reaching the end
     return color;
   };
};

// Call getNextColor()
export const getNextColor = createColorGenerator();
