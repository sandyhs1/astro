/**
 * ASTROLOGY ENGINE — ADVANCED VEDIC POINTS
 *
 * Computes highly sensitive, mathematically precise degrees
 * for advanced predictive accuracy.
 */

const MRITYU_BHAGA: Record<string, Record<number, number>> = {
  Sun:     { 1: 20, 2: 9,  3: 12, 4: 6,  5: 8,  6: 24, 7: 16, 8: 17, 9: 22, 10: 2,  11: 3,  12: 23 },
  Moon:    { 1: 8,  2: 25, 3: 22, 4: 22, 5: 21, 6: 1,  7: 4,  8: 23, 9: 18, 10: 20, 11: 20, 12: 10 },
  Mars:    { 1: 19, 2: 28, 3: 25, 4: 23, 5: 29, 6: 28, 7: 14, 8: 21, 9: 2,  10: 15, 11: 11, 12: 6  },
  Mercury: { 1: 15, 2: 14, 3: 13, 4: 12, 5: 8,  6: 18, 7: 20, 8: 10, 9: 21, 10: 22, 11: 7,  12: 5  },
  Jupiter: { 1: 19, 2: 29, 3: 12, 4: 27, 5: 6,  6: 4,  7: 13, 8: 10, 9: 17, 10: 11, 11: 15, 12: 28 },
  Venus:   { 1: 28, 2: 15, 3: 11, 4: 17, 5: 10, 6: 13, 7: 4,  8: 6,  9: 27, 10: 12, 11: 29, 12: 19 },
  Saturn:  { 1: 10, 2: 4,  3: 7,  4: 9,  5: 12, 6: 16, 7: 3,  8: 18, 9: 28, 10: 14, 11: 13, 12: 15 },
  Rahu:    { 1: 14, 2: 13, 3: 12, 4: 11, 5: 24, 6: 23, 7: 22, 8: 21, 9: 10, 10: 20, 11: 18, 12: 8  },
  Ketu:    { 1: 8,  2: 18, 3: 8,  4: 21, 5: 10, 6: 20, 7: 21, 8: 22, 9: 23, 10: 24, 11: 11, 12: 12 },
};

/**
 * Returns true if a planet is in its specific Mrityu Bhaga (Fatal Degree).
 * We apply a standard orb of +/- 1 degree around the exact MB point.
 */
export function isMrityuBhaga(planetName: string, signNum: number, degree: number): boolean {
  const mbMap = MRITYU_BHAGA[planetName];
  if (!mbMap) return false;
  const exactMB = mbMap[signNum];
  if (exactMB === undefined) return false;
  // Orb of 1 degree
  return degree >= exactMB - 1 && degree < exactMB + 1;
}

/**
 * Returns true if a planet is in Pushkara Bhaga (Nourishing/Blessing Degree).
 */
export function isPushkaraBhaga(signNum: number, degree: number): boolean {
  const FIRE = [1, 5, 9];   // Aries, Leo, Sagittarius
  const EARTH = [2, 6, 10]; // Taurus, Virgo, Capricorn
  const AIR = [3, 7, 11];   // Gemini, Libra, Aquarius
  const WATER = [4, 8, 12]; // Cancer, Scorpio, Pisces

  let exactPB = -1;
  if (FIRE.includes(signNum)) exactPB = 21;
  else if (EARTH.includes(signNum)) exactPB = 14;
  else if (AIR.includes(signNum)) exactPB = 24;
  else if (WATER.includes(signNum)) exactPB = 7;

  if (exactPB === -1) return false;
  return degree >= exactPB - 1 && degree < exactPB + 1;
}

/**
 * Returns true if a planet is in a Pushkara Navamsa segment.
 * Each segment is exactly 3°20' (3.3333 degrees).
 */
export function isPushkaraNavamsa(signNum: number, degree: number): boolean {
  const FIRE = [1, 5, 9];
  const EARTH = [2, 6, 10];
  const AIR = [3, 7, 11];
  const WATER = [4, 8, 12];

  const inRange = (d: number, start: number, end: number) => d >= start && d < end;

  // 20:00 to 23:20 and 26:40 to 30:00
  if (FIRE.includes(signNum)) {
    return inRange(degree, 20.0, 23.3333) || inRange(degree, 26.6667, 30.0);
  }
  // 06:40 to 10:00 and 13:20 to 16:40
  if (EARTH.includes(signNum)) {
    return inRange(degree, 6.6667, 10.0) || inRange(degree, 13.3333, 16.6667);
  }
  // 16:40 to 20:00 and 23:20 to 26:40
  if (AIR.includes(signNum)) {
    return inRange(degree, 16.6667, 20.0) || inRange(degree, 23.3333, 26.6667);
  }
  // 00:00 to 03:20 and 06:40 to 10:00
  if (WATER.includes(signNum)) {
    return inRange(degree, 0.0, 3.3333) || inRange(degree, 6.6667, 10.0);
  }

  return false;
}
