// Use production URL by default, fall back to env var or localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://electro-1-t0p1.onrender.com';
export const API = API_URL;

console.log('API URL:', API); // Debug log

export const CATEGORIES = [
  { label: 'All',         icon: 'RiHomeLine' },
  { label: 'Home Appliances',  icon: 'RiHomeLine' },
  { label: 'Smartphones', icon: 'RiSmartphoneLine' },
  { label: 'Laptops',     icon: 'RiMacbookLine' },
  { label: 'Audio',       icon: 'RiHeadphoneLine' },
  { label: 'Wearables',   icon: 'RiWatchLine' },
  { label: 'Cameras',     icon: 'RiCameraLine' },
  { label: 'Accessories', icon: 'RiPlugLine' },
  { label: 'TV',          icon: 'RiTvLine' },
  { label: 'Soundbar',    icon: 'RiSoundModuleLine' },
  { label: 'Gaming',      icon: 'RiGamepadLine' },
  { label: 'Drones',      icon: 'RiDroneLine' },
  { label: 'Printers',    icon: 'RiPrinterLine' },
  { label: 'Networking',  icon: 'RiRouterLine' },
  { label: 'Storage',     icon: 'RiHardDriveLine' },
  { label: 'Software',    icon: 'RiComputerLine' }
];

export const SORT_OPTIONS = [
  { value: 'default',   label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc',label: 'Price: High → Low' },
  { value: 'name_asc',  label: 'Price: A → Z' },
];