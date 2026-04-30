export const API = 'http://localhost:5000';

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