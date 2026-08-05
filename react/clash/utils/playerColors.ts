// A curated palette of dark shades. They are deliberately deep/saturated so a
// player's name stays readable as chalk on the dark chalkboard while each color
// remains distinct from its neighbours.
export const PLAYER_COLORS = [
  "#7f1d1d", // dark red
  "#9a3412", // dark orange
  "#854d0e", // dark amber
  "#3f6212", // dark lime
  "#166534", // dark green
  "#115e59", // dark teal
  "#155e75", // dark cyan
  "#1e3a8a", // dark blue
  "#3730a3", // dark indigo
  "#5b21b6", // dark violet
  "#86198f", // dark fuchsia
  "#9d174d", // dark pink
] as const;

// Pick a dark shade for a joining player. Random from the palette keeps things
// simple; the server has no color logic, so the client owns this entirely.
export const pickPlayerColor = (): string =>
  PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
