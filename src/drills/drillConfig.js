/**
 * Global game defaults – tweak visual / gameplay settings here.
 */
export const GAME_DEFAULTS = {
    /** Font size for the letter displayed on each alien (CSS size string). */
    alienLetterFontSize: '18px',

    /** Probability (0–1) that a spawned alien carries a word instead of a single letter. */
    wordChance: 0.6,

    /** Minimum word length for word-aliens. */
    wordMinLength: 2,

    /** Maximum word length for word-aliens. */
    wordMaxLength: 5,

    /** Delay (ms) before spawning the next alien after the current one is destroyed/escaped. */
    spawnDelayMs: 300,
};

/**
 * Drill configuration for Typeroids.
 * To add a new drill, simply push a new object to this array.
 *
 * Each drill may optionally override GAME_DEFAULTS values, e.g.:
 *   alienLetterFontSize: '22px'
 *   wordChance: 0.8
 *
 * difficulty.alienSpeed: { start, end } in px/sec – how fast aliens fall,
 *   interpolated linearly from start → end over the drill.
 */
export const DRILLS = [
    {
        id: 'home-row-left',
        name: 'Home Row – Left',
        keys: ['a', 's', 'd', 'f'],
        alienCount: 40,
        difficulty: {
            alienSpeed: { start: 120, end: 200 },
        },
        starThresholds: { three: 95, two: 80, one: 60 },
    },
    {
        id: 'home-row-right',
        name: 'Home Row – Right',
        keys: ['j', 'k', 'l', ';'],
        alienCount: 40,
        difficulty: {
            alienSpeed: { start: 120, end: 200 },
        },
        starThresholds: { three: 95, two: 80, one: 60 },
    },
    {
        id: 'home-row-full',
        name: 'Full Home Row',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        alienCount: 50,
        difficulty: {
            alienSpeed: { start: 130, end: 220 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'top-row',
        name: 'Top Row',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        alienCount: 50,
        difficulty: {
            alienSpeed: { start: 110, end: 200 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'bottom-row',
        name: 'Bottom Row',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        alienCount: 45,
        difficulty: {
            alienSpeed: { start: 130, end: 220 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'all-letters',
        name: 'All Letters',
        keys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        alienCount: 60,
        difficulty: {
            alienSpeed: { start: 140, end: 240 },
        },
        starThresholds: { three: 85, two: 70, one: 50 },
    },
    {
        id: 'numbers',
        name: 'Numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        alienCount: 45,
        difficulty: {
            alienSpeed: { start: 130, end: 220 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'mixed',
        name: 'Letters & Numbers',
        keys: 'abcdefghijklmnopqrstuvwxyz1234567890'.split(''),
        alienCount: 60,
        difficulty: {
            alienSpeed: { start: 150, end: 260 },
        },
        starThresholds: { three: 80, two: 65, one: 45 },
    },
];
