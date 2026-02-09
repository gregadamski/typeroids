/**
 * Tracks gameplay statistics during a drill.
 */
export class StatsTracker {
    constructor() {
        this.hits = 0;
        this.misses = 0;
        this.totalAliens = 0;
        this.aliensEscaped = 0;
        this.startTime = null;
        this.endTime = null;
        this.keystrokes = 0;
    }

    start() {
        this.startTime = Date.now();
    }

    stop() {
        this.endTime = Date.now();
    }

    recordHit() {
        this.hits++;
        this.keystrokes++;
    }

    recordMiss() {
        this.misses++;
        this.keystrokes++;
    }

    recordEscape() {
        this.aliensEscaped++;
    }

    getAccuracy() {
        if (this.keystrokes === 0) return 0;
        return Math.round((this.hits / this.keystrokes) * 100);
    }

    /** Characters per minute / 5 = WPM approximation */
    getWPM() {
        const elapsed = ((this.endTime || Date.now()) - this.startTime) / 1000 / 60; // minutes
        if (elapsed <= 0) return 0;
        return Math.round(this.hits / 5 / elapsed);
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
