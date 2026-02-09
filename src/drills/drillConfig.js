/**
 * Global game defaults – tweak visual / gameplay settings here.
 */
export const GAME_DEFAULTS = {
    /** Font size for the letter displayed on each alien (CSS size string). */
    alienLetterFontSize: '18px',

    /** Minimum ms between accepting the same key again (anti-spam). */
    keyCooldownMs: 100,

    /**
     * How many consecutive misses before the player loses a life.
     * Set to 0 or Infinity to disable.
     */
    missStreakLifePenalty: 5,
};

/**
 * Drill configuration for Typeroids.
 * To add a new drill, simply push a new object to this array.
 *
 * Each drill may optionally override GAME_DEFAULTS values, e.g.:
 *   alienLetterFontSize: '22px'
 *
 * difficulty.spawnInterval: { start, end } in ms – time between spawns,
 *   interpolated linearly from start → end over the drill.
 * difficulty.alienSpeed: { start, end } in px/sec – how fast aliens fall,
 *   interpolated the same way.
 */
export const DRILLS = [
    {
        id: 'home-row-left',
        name: 'Home Row – Left',
        keys: ['a', 's', 'd', 'f'],
        alienCount: 80,
        difficulty: {
            spawnInterval: { start: 1100, end: 600 },
            alienSpeed: { start: 56, end: 80 },
        },
        starThresholds: { three: 95, two: 80, one: 60 },
    },
    {
        id: 'home-row-right',
        name: 'Home Row – Right',
        keys: ['j', 'k', 'l', ';'],
        alienCount: 80,
        difficulty: {
            spawnInterval: { start: 1100, end: 600 },
            alienSpeed: { start: 56, end: 80 },
        },
        starThresholds: { three: 95, two: 80, one: 60 },
    },
    {
        id: 'home-row-full',
        name: 'Full Home Row',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        alienCount: 120,
        difficulty: {
            spawnInterval: { start: 1000, end: 500 },
            alienSpeed: { start: 60, end: 96 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'top-row',
        name: 'Top Row',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        alienCount: 240,
        difficulty: {
            spawnInterval: { start: 2000, end: 100 },
            alienSpeed: { start: 30, end: 60 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'bottom-row',
        name: 'Bottom Row',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        alienCount: 100,
        difficulty: {
            spawnInterval: { start: 1000, end: 500 },
            alienSpeed: { start: 60, end: 96 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'all-letters',
        name: 'All Letters',
        keys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        alienCount: 160,
        difficulty: {
            spawnInterval: { start: 900, end: 400 },
            alienSpeed: { start: 64, end: 110 },
        },
        starThresholds: { three: 85, two: 70, one: 50 },
    },
    {
        id: 'numbers',
        name: 'Numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        alienCount: 120,
        difficulty: {
            spawnInterval: { start: 1000, end: 500 },
            alienSpeed: { start: 60, end: 96 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'mixed',
        name: 'Letters & Numbers',
        keys: 'abcdefghijklmnopqrstuvwxyz1234567890'.split(''),
        alienCount: 200,
        difficulty: {
            spawnInterval: { start: 800, end: 325 },
            alienSpeed: { start: 68, end: 120 },
        },
        starThresholds: { three: 80, two: 65, one: 45 },
    },
];
