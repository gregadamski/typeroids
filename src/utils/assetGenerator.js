import Phaser from 'phaser';

/**
 * Generate all game textures procedurally so we need zero external asset files.
 */
export function generateTextures(scene) {
    // ─── Cannon ───
    if (!scene.textures.exists('cannon')) {
        const cg = scene.make.graphics({ add: false });
        // Barrel
        cg.fillStyle(0x44aaff, 1);
        cg.fillRect(18, 0, 12, 28);
        // Barrel highlight
        cg.fillStyle(0x77ccff, 1);
        cg.fillRect(22, 0, 4, 28);
        // Body
        cg.fillStyle(0x3388dd, 1);
        cg.fillRoundedRect(4, 24, 40, 24, 6);
        // Body highlight
        cg.fillStyle(0x55aaee, 1);
        cg.fillRoundedRect(10, 27, 28, 8, 4);
        // Base
        cg.fillStyle(0x2266aa, 1);
        cg.fillRoundedRect(0, 40, 48, 12, 4);
        cg.generateTexture('cannon', 48, 52);
        cg.destroy();
    }

    // ─── Alien ───
    if (!scene.textures.exists('alien')) {
        const ag = scene.make.graphics({ add: false });
        // Glow
        ag.fillStyle(0x00ff88, 0.15);
        ag.fillCircle(24, 24, 24);
        // Body
        ag.fillStyle(0x22cc66, 1);
        ag.fillCircle(24, 24, 18);
        // Inner shine
        ag.fillStyle(0x44ee88, 0.6);
        ag.fillCircle(20, 18, 8);
        // Eyes
        ag.fillStyle(0x000000, 1);
        ag.fillCircle(18, 22, 3);
        ag.fillCircle(30, 22, 3);
        // Eye shine
        ag.fillStyle(0xffffff, 1);
        ag.fillCircle(19, 21, 1.2);
        ag.fillCircle(31, 21, 1.2);
        ag.generateTexture('alien', 48, 48);
        ag.destroy();
    }

    // ─── Missile ───
    if (!scene.textures.exists('missile')) {
        const mg = scene.make.graphics({ add: false });
        mg.fillStyle(0xffdd44, 1);
        mg.fillRect(2, 0, 4, 14);
        mg.fillStyle(0xff8800, 1);
        mg.fillTriangle(4, 14, 0, 10, 8, 10);
        mg.fillStyle(0xffff88, 1);
        mg.fillRect(3, 1, 2, 6);
        mg.generateTexture('missile', 8, 14);
        mg.destroy();
    }

    // ─── Particle (small circle for explosions) ───
    if (!scene.textures.exists('particle')) {
        const pg = scene.make.graphics({ add: false });
        pg.fillStyle(0xffffff, 1);
        pg.fillCircle(4, 4, 4);
        pg.generateTexture('particle', 8, 8);
        pg.destroy();
    }

    // ─── Heart ───
    if (!scene.textures.exists('heart')) {
        const hg = scene.make.graphics({ add: false });
        hg.fillStyle(0xff3366, 1);
        hg.fillCircle(8, 7, 6);
        hg.fillCircle(18, 7, 6);
        hg.fillTriangle(2, 10, 24, 10, 13, 22);
        hg.generateTexture('heart', 26, 24);
        hg.destroy();
    }

    // ─── Star (for ratings) ───
    if (!scene.textures.exists('star')) {
        const sg = scene.make.graphics({ add: false });
        sg.fillStyle(0xffcc00, 1);
        // Simple 5-pointed star
        const cx = 12, cy = 12, outerR = 12, innerR = 5;
        const points = [];
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (Math.PI / 2) + (i * Math.PI / 5);
            points.push(cx - Math.cos(angle) * r);
            points.push(cy - Math.sin(angle) * r);
        }
        sg.fillPoints(points.map((v, i) => {
            return i % 2 === 0
                ? new Phaser.Geom.Point(points[i], points[i + 1])
                : null;
        }).filter(Boolean));
        // Simpler approach: just draw a filled polygon
        sg.clear();
        sg.fillStyle(0xffcc00, 1);
        sg.beginPath();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = -Math.PI / 2 + (i * Math.PI / 5);
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) sg.moveTo(px, py);
            else sg.lineTo(px, py);
        }
        sg.closePath();
        sg.fillPath();
        sg.generateTexture('star', 24, 24);
        sg.destroy();
    }

    // ─── Empty star ───
    if (!scene.textures.exists('star-empty')) {
        const sg2 = scene.make.graphics({ add: false });
        const cx = 12, cy = 12, outerR = 12, innerR = 5;
        sg2.lineStyle(2, 0x666666, 1);
        sg2.beginPath();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = -Math.PI / 2 + (i * Math.PI / 5);
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) sg2.moveTo(px, py);
            else sg2.lineTo(px, py);
        }
        sg2.closePath();
        sg2.strokePath();
        sg2.generateTexture('star-empty', 24, 24);
        sg2.destroy();
    }
}

/**
 * Generate simple sound effects using Web Audio API oscillators.
 */
export function generateSounds(scene) {
    const audioCtx = scene.sound.context;
    if (!audioCtx) return;

    // Helper to make a short buffer from oscillator params
    function makeBuffer(duration, type, freqStart, freqEnd, gainStart, gainEnd) {
        const sampleRate = audioCtx.sampleRate;
        const length = Math.floor(sampleRate * duration);
        const buffer = audioCtx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const progress = i / length;
            const freq = freqStart + (freqEnd - freqStart) * progress;
            const gain = gainStart + (gainEnd - gainStart) * progress;
            let sample = 0;
            if (type === 'sine') sample = Math.sin(2 * Math.PI * freq * t);
            else if (type === 'square') sample = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
            else if (type === 'noise') sample = Math.random() * 2 - 1;
            data[i] = sample * gain * 0.3;
        }
        return buffer;
    }

    // Shoot sound – short rising beep
    if (!scene.cache.audio.has('shoot')) {
        const buf = makeBuffer(0.1, 'square', 600, 1200, 0.5, 0);
        scene.cache.audio.add('shoot', { buffer: buf });
    }

    // Explode sound – noise burst
    if (!scene.cache.audio.has('explode')) {
        const buf = makeBuffer(0.25, 'noise', 200, 80, 0.7, 0);
        scene.cache.audio.add('explode', { buffer: buf });
    }

    // Life lost – low thud
    if (!scene.cache.audio.has('life-lost')) {
        const buf = makeBuffer(0.3, 'sine', 150, 50, 0.6, 0);
        scene.cache.audio.add('life-lost', { buffer: buf });
    }

    // Level complete – ascending arpeggio
    if (!scene.cache.audio.has('level-complete')) {
        const sampleRate = audioCtx.sampleRate;
        const duration = 0.6;
        const length = Math.floor(sampleRate * duration);
        const buffer = audioCtx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const progress = i / length;
            const noteIdx = Math.min(Math.floor(progress * notes.length), notes.length - 1);
            const freq = notes[noteIdx];
            const fadeOut = 1 - progress;
            data[i] = Math.sin(2 * Math.PI * freq * t) * fadeOut * 0.25;
        }
        scene.cache.audio.add('level-complete', { buffer: buffer });
    }
}
