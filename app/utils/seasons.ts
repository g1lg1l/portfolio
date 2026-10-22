// What falls behind the pages, season by season (northern hemisphere, by month).
// shape: 0 square, 1 round, 2 snowflake, 3 petal, 4 leaf. wind: degrees, as in Vue Bits' PixelSnow
// (around 125 drifts down and to the right, negative rises). Colours for each theme: three, picked per flake.
export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export const SEASONS: Record<
  Season,
  {
    label: string
    icon: string
    shape: number
    density: number
    speed: number
    wind: number
    size: number
    // Fireflies pulse; nothing else does
    twinkle: number
    dark: [string, string, string]
    light: [string, string, string]
  }
> = {
  winter: {
    label: 'Winter',
    icon: 'i-pixelarticons-snowflake',
    shape: 2,
    density: 0.25,
    speed: 1,
    wind: 125,
    size: 0.02,
    twinkle: 0,
    dark: ['#ffffff', '#e0e7ff', '#c7d2fe'],
    light: ['#818cf8', '#a5b4fc', '#6366f1']
  },
  spring: {
    label: 'Spring',
    icon: 'i-pixel-flower',
    shape: 3,
    density: 0.12,
    speed: 0.7,
    wind: 150,
    size: 0.03,
    twinkle: 0,
    dark: ['#f9a8d4', '#fbcfe8', '#ffffff'],
    light: ['#ec4899', '#f472b6', '#db2777']
  },
  summer: {
    label: 'Summer',
    icon: 'i-pixelarticons-sun',
    shape: 1,
    density: 0.1,
    speed: 0.35,
    wind: -70,
    size: 0.022,
    twinkle: 1,
    dark: ['#fde047', '#bef264', '#facc15'],
    light: ['#ca8a04', '#65a30d', '#a16207']
  },
  autumn: {
    label: 'Autumn',
    icon: 'i-pixelarticons-leaf',
    shape: 4,
    density: 0.08,
    speed: 0.8,
    wind: 115,
    size: 0.035,
    twinkle: 0,
    dark: ['#fb923c', '#ef4444', '#eab308'],
    light: ['#ea580c', '#b91c1c', '#a16207']
  }
}

export const SEASON_ORDER: Season[] = ['winter', 'spring', 'summer', 'autumn']

export function seasonOf(date: Date): Season {
  const month = date.getMonth()
  if (month === 11 || month < 2) return 'winter'
  if (month < 5) return 'spring'
  if (month < 8) return 'summer'
  return 'autumn'
}
