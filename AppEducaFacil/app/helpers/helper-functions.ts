import { useWindowDimensions } from "react-native";

export function fitString(string: string, maxLength = 20): string {
  if (!string || maxLength <= 0) return "";

  const trimmed = string.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  const parts = trimmed.split(/\s+/);


  if (parts.length === 1) {
    if (maxLength <= 3) return trimmed.slice(0, maxLength); 
    return trimmed.slice(0, maxLength - 3) + "...";
  }

  let combined = `${parts[0]} ${parts[parts.length - 1]}`;


  if (combined.length > maxLength) {
    if (maxLength <= 3) return combined.slice(0, maxLength);
    combined = combined.slice(0, maxLength - 3) + "...";
  }

  return combined;
}
