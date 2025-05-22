export type StatusColor = "green" | "yellow" | "red";

export function getStatusStyles(color: StatusColor) {
  return {
    bgColor: {
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
    }[color],

    textColor: {
      green: "text-green-500",
      yellow: "text-yellow-500",
      red: "text-red-500",
    }[color],
  };
}
