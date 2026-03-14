/**
 * Tracks gameplay statistics during a drill.
 */
export class StatsTracker {
    constructor() {
        this.hits = 0;          // aliens destroyed
        this.misses = 0;        // wrong key presses
        this.totalAliens = 0;
        this.aliensEscaped = 0;
        this.startTime = null;
        this.endTime = null;
        this.keystrokes = 0;    // total correct keystrokes (for WPM)
    }

    start() {
        this.startTime = Date.now();
    }

    stop() {
        this.endTime = Date.now();
    }

    /**
     * Record a successful alien kill.
     * @param {number} wordLength - Number of characters in the word (for keystroke tracking)
     */
    recordHit(wordLength = 1) {
        this.hits++;
        this.keystrokes += wordLength;
    }

    /** Record a wrong keypress (miss). */
    recordMiss() {
        this.misses++;
    }

    /** Record a single correct keystroke (called per character while typing a word). */
    recordKeystroke() {
        // Tracked separately so WPM can be calculated from keystrokes.
        // keystrokes are also added in bulk via recordHit, so this is only
        // used for real-time WPM if needed in the future.
    }

    recordEscape() {
        this.aliensEscaped++;
    }

    getAccuracy() {
        const total = this.keystrokes + this.misses;
        if (total === 0) return 0;
        return Math.round((this.keystrokes / total) * 100);
    }

    /** Characters per minute / 5 = WPM approximation */
    getWPM() {
        const elapsed = ((this.endTime || Date.now()) - this.startTime) / 1000 / 60; // minutes
        if (elapsed <= 0) return 0;
        return Math.round(this.keystrokes / 5 / elapsed);
    }

    getElapsedSeconds() {
        return Math.round(((this.endTime || Date.now()) - this.startTime) / 1000);
    }

    getStarRating(thresholds) {
        const acc = this.getAccuracy();
        if (acc >= thresholds.three) return 3;
        if (acc >= thresholds.two) return 2;
        if (acc >= thresholds.one) return 1;
        return 0;
    }
}
