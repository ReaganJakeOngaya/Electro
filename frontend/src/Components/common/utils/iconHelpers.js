// src/utils/iconHelpers.js
import * as RiIcons from 'react-icons/ri';

/**
 * Safely retrieve an icon component by its name (e.g., 'RiSmartphoneLine').
 * Falls back to RiHomeLine if the requested icon does not exist.
 */
export const getIconComponent = (iconName) => {
  const Icon = RiIcons[iconName];
  if (Icon) return Icon;
  // Fallback to a known icon
  return RiIcons.RiHomeLine;
};