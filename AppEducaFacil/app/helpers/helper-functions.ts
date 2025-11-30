import { useWindowDimensions } from "react-native";

// this function formats a string to fit within a specified maximum length
// it handles 2 different cases: if its one big word or multiple words
export function fitString(string: string, maxLength = 20): string {
  if (!string || maxLength <= 0) return "";

  const trimmed = string.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  const parts = trimmed.split(/\s+/);

  // one big word we truncate and add "..."
  if (parts.length === 1) {
    if (maxLength <= 3) return trimmed.slice(0, maxLength); // not enough space for "..."
    return trimmed.slice(0, maxLength - 3) + "...";
  }

  // multiple words, first + last
  let combined = `${parts[0]} ${parts[parts.length - 1]}`;

  // if even "first last" is too long, truncate that
  if (combined.length > maxLength) {
    if (maxLength <= 3) return combined.slice(0, maxLength);
    combined = combined.slice(0, maxLength - 3) + "...";
  }

  return combined;
}
