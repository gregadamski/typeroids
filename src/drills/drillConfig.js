/**
 * Global game defaults – tweak visual / gameplay settings here.
 */
export const GAME_DEFAULTS = {
    /** Font size for the letter displayed on each alien (CSS size string). */
    alienLetterFontSize: '18px',
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
        alienCount: 20,
        difficulty: {
            spawnInterval: { start: 2200, end: 1200 },
            alienSpeed: { start: 28, end: 40 },
        },
        starThresholds: { three: 95, two: 80, one: 60 },
    },
    {
        id: 'home-row-right',
        name: 'Home Row – Right',
        keys: ['j', 'k', 'l', ';'],
        alienCount: 20,
        difficulty: {
            spawnInterval: { start: 2200, end: 1200 },
            alienSpeed: { start: 28, end: 40 },
        },
        starThresholds: { three: 95, two: 80, one: 60 },
    },
    {
        id: 'home-row-full',
        name: 'Full Home Row',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        alienCount: 30,
        difficulty: {
            spawnInterval: { start: 2000, end: 1000 },
            alienSpeed: { start: 30, end: 48 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'top-row',
        name: 'Top Row',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        alienCount: 30,
        difficulty: {
            spawnInterval: { start: 2000, end: 1000 },
            alienSpeed: { start: 30, end: 48 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'bottom-row',
        name: 'Bottom Row',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        alienCount: 25,
        difficulty: {
            spawnInterval: { start: 2000, end: 1000 },
            alienSpeed: { start: 30, end: 48 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'all-letters',
        name: 'All Letters',
        keys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        alienCount: 40,
        difficulty: {
            spawnInterval: { start: 1800, end: 800 },
            alienSpeed: { start: 32, end: 55 },
        },
        starThresholds: { three: 85, two: 70, one: 50 },
    },
    {
        id: 'numbers',
        name: 'Numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        alienCount: 30,
        difficulty: {
            spawnInterval: { start: 2000, end: 1000 },
            alienSpeed: { start: 30, end: 48 },
        },
        starThresholds: { three: 90, two: 75, one: 55 },
    },
    {
        id: 'mixed',
        name: 'Letters & Numbers',
        keys: 'abcdefghijklmnopqrstuvwxyz1234567890'.split(''),
        alienCount: 50,
        difficulty: {
            spawnInterval: { start: 1600, end: 650 },
            alienSpeed: { start: 34, end: 60 },
        },
        starThresholds: { three: 80, two: 65, one: 45 },
    },
];
