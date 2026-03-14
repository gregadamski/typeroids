import Phaser from 'phaser';
import { createStarfield, updateStarfield } from '../utils/starfield.js';
import { StatsTracker } from '../utils/stats.js';
import { GAME_DEFAULTS } from '../drills/drillConfig.js';
import { Cannon } from '../entities/Cannon.js';
import { Alien } from '../entities/Alien.js';
import { Missile } from '../entities/Missile.js';
import { pickAlienWord } from '../utils/wordGenerator.js';
import { t, drillName } from '../utils/i18n.js';

/**
 * Core gameplay scene.
 * One alien at a time; aliens carry words that must be fully typed.
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.drill = data.drill;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // ─── State ───
        this._currentAlien = null;
        this.lives = 3;
        this.score = 0;
        this._comboMultiplier = 1;
        this._comboCount = 0;
        this._aliensSpawned = 0;
        this._drillComplete = false;
        this._paused = false;
        this._activeMissile = null;

        // ─── Word config ───
        this._wordChance = this.drill.wordChance ?? GAME_DEFAULTS.wordChance;
        this._wordMinLength = this.drill.wordMinLength ?? GAME_DEFAULTS.wordMinLength;
        this._wordMaxLength = this.drill.wordMaxLength ?? GAME_DEFAULTS.wordMaxLength;
        this._spawnDelayMs = this.drill.spawnDelayMs ?? GAME_DEFAULTS.spawnDelayMs;

        this.stats = new StatsTracker();
        this.stats.totalAliens = this.drill.alienCount;

        // ─── Background ───
        createStarfield(this);

        // ─── Cannon ───
        this.cannon = new Cannon(this, W / 2, H - 40);

        // ─── HUD ───
        this._createHUD();

        // ─── Spawn the first alien ───
        this._scheduleNextSpawn();

        // ─── Keyboard input ───
        this.input.keyboard.on('keydown', this._onKeyDown, this);

        // ─── Start stats ───
        this.stats.start();

        // ─── Pause overlay (hidden) ───
        this._createPauseOverlay();

        // Camera fade in
        this.cameras.main.fadeIn(300);
    }

    // ─── HUD ───────────────────────────────────────────────────────

    _createHUD() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Score
        this.scoreText = this.add.text(24, 16, t('hud.score') + ': 0', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '22px',
            color: '#ffffff',
        }).setDepth(50);

        // Combo
        this.comboText = this.add.text(24, 48, '', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '16px',
            color: '#ffdd44',
        }).setDepth(50);

        // Drill name
        this.add.text(W / 2, 16, drillName(this.drill.id), {
            fontFamily: '"Courier New", monospace',
            fontSize: '18px',
            color: '#667788',
        }).setOrigin(0.5, 0).setDepth(50);

        // Lives
        this.heartIcons = [];
        for (let i = 0; i < 3; i++) {
            const heart = this.add.image(W - 40 - i * 50, 28, 'heart')
                .setScale(1.2)
                .setDepth(50);
            this.heartIcons.push(heart);
        }

        // Progress bar background
        this.add.rectangle(W / 2, H - 10, W - 20, 8, 0x111133, 0.5).setDepth(50);
        this.progressBar = this.add.rectangle(10, H - 10, 0, 6, 0x44aaff, 0.8)
            .setOrigin(0, 0.5)
            .setDepth(50);
    }

    _updateHUD() {
        const W = this.scale.width;

        this.scoreText.setText(t('hud.score') + ': ' + this.score);

        if (this._comboCount >= 2) {
            this.comboText.setText(t('hud.combo') + ' x' + this._comboMultiplier);
            this.comboText.setVisible(true);
        } else {
            this.comboText.setVisible(false);
        }

        // Progress bar
        const progress = this._aliensSpawned / this.drill.alienCount;
        this.progressBar.width = (W - 20) * progress;
    }

    // ─── Pause ─────────────────────────────────────────────────────

    _createPauseOverlay() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.pauseOverlay = this.add.container(0, 0).setDepth(100).setVisible(false);

        const bg = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7);
        const text = this.add.text(W / 2, H / 2 - 30, t('pause.title'), {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '52px',
            color: '#44aaff',
        }).setOrigin(0.5);
        const hint = this.add.text(W / 2, H / 2 + 30, t('pause.hint'), {
            fontFamily: '"Courier New", monospace',
            fontSize: '20px',
            color: '#667788',
        }).setOrigin(0.5);

        this.pauseOverlay.add([bg, text, hint]);
    }

    _togglePause() {
        this._paused = !this._paused;
        this.pauseOverlay.setVisible(this._paused);

        if (this._paused) {
            this.tweens.pauseAll();
        } else {
            this.tweens.resumeAll();
        }
    }

    // ─── Spawning (one at a time) ─────────────────────────────────

    /** Schedule the next alien spawn after a short delay. */
    _scheduleNextSpawn() {
        if (this._aliensSpawned >= this.drill.alienCount || this._drillComplete) return;

        this.time.delayedCall(this._spawnDelayMs, () => {
            if (!this._drillComplete) this._spawnAlien();
        });
    }

    _spawnAlien() {
        if (this._drillComplete) return;

        const W = this.scale.width;

        const word = pickAlienWord(this.drill, this._wordChance, this._wordMinLength, this._wordMaxLength);
        const x = Phaser.Math.Between(80, W - 80);
        const y = -30;

        // Speed ramp from difficulty config
        const progress = this._aliensSpawned / this.drill.alienCount;
        const { start, end } = this.drill.difficulty.alienSpeed;
        const speed = start + (end - start) * progress;

        this._currentAlien = new Alien(this, x, y, word, speed, this.drill);
        this._aliensSpawned++;
        this._updateHUD();
    }

    // ─── Input ─────────────────────────────────────────────────────

    _onKeyDown(event) {
        if (event.key === 'Escape') {
            this._togglePause();
            return;
        }

        if (this._paused || this._drillComplete) return;
        if (!this._currentAlien || !this._currentAlien.alive) return;
        if (this._activeMissile) return; // wait for missile to land

        const key = event.key.toLowerCase();

        // Ignore modifier keys, function keys, etc.
        if (key.length > 1) return;

        const expected = this._currentAlien.nextChar();
        if (!expected) return;

        if (key === expected) {
            // ── Correct key ──
            this._currentAlien.advanceChar();
            this.stats.recordKeystroke();

            if (this._currentAlien.isFullyTyped()) {
                // Word complete → fire missile (alien keeps moving)
                const alien = this._currentAlien;

                this.cannon.aimAt(alien.x, alien.y);
                this.cannon.fire();
                this._playSound('shoot');

                this._activeMissile = new Missile(this, this.cannon.x, this.cannon.y - 30, alien, () => {
                    this._activeMissile = null;
                    if (!alien.alive) return;
                    alien.explode();
                    this._playSound('explode');

                    // Scoring: 100 points per character × combo multiplier
                    this._comboCount++;
                    this._comboMultiplier = Math.min(5, 1 + Math.floor(this._comboCount / 3));
                    this.score += 100 * alien.word.length * this._comboMultiplier;
                    this.stats.recordHit(alien.word.length);
                    this._updateHUD();

                    // Spawn next alien
                    this._currentAlien = null;
                    this._checkDrillComplete();
                    if (!this._drillComplete) {
                        this._scheduleNextSpawn();
                    }
                });
            }
        } else {
            // ── Wrong key ──
            this._currentAlien.resetProgress();
            this._comboCount = 0;
            this._comboMultiplier = 1;
            this.stats.recordMiss();
            this._updateHUD();
        }
    }

    // ─── Alien escaped ─────────────────────────────────────────────

    _onAlienEscaped(alien) {
        if (!alien.alive) return;
        alien.alive = false;
        alien.destroy();

        this.lives--;
        this.stats.recordEscape();
        this._comboCount = 0;
        this._comboMultiplier = 1;

        // Flash the lost heart
        if (this.heartIcons[this.lives]) {
            this.heartIcons[this.lives].setAlpha(0.2);
        }

        // Camera shake
        this.cameras.main.shake(250, 0.01);

        // Red flash
        this.cameras.main.flash(200, 255, 50, 50, false);

        this._playSound('life-lost');
        this._updateHUD();

        // Cancel any in-flight missile targeting this alien
        if (this._activeMissile) {
            this._activeMissile.trail.stop();
            this._activeMissile.scene.time.delayedCall(300, () => {
                if (this._activeMissile && this._activeMissile.trail) this._activeMissile.trail.destroy();
            });
            this._activeMissile.destroy();
            this._activeMissile = null;
        }

        if (this.lives <= 0) {
            this._currentAlien = null;
            this._endGame(false);
        } else {
            this._currentAlien = null;
            this._checkDrillComplete();
            if (!this._drillComplete) {
                this._scheduleNextSpawn();
            }
        }
    }

    // ─── Drill completion ──────────────────────────────────────────

    _checkDrillComplete() {
        if (this._drillComplete) return;

        // All aliens spawned and no current alien alive
        if (this._aliensSpawned >= this.drill.alienCount && !this._currentAlien) {
            this._endGame(true);
        }
    }

    _endGame(completed) {
        if (this._drillComplete) return;
        this._drillComplete = true;
        this.stats.stop();

        this.input.keyboard.off('keydown', this._onKeyDown, this);

        if (completed) {
            this._playSound('level-complete');
        }

        // Short delay then show results
        this.time.delayedCall(completed ? 800 : 500, () => {
            this.cameras.main.fade(400, 0, 0, 0, false, (cam, progress) => {
                if (progress >= 1) {
                    this.scene.start('GameOverScene', {
                        drill: this.drill,
                        score: this.score,
                        stats: {
                            accuracy: this.stats.getAccuracy(),
                            wpm: this.stats.getWPM(),
                            hits: this.stats.hits,
                            misses: this.stats.misses,
                            escaped: this.stats.aliensEscaped,
                            totalAliens: this.stats.totalAliens,
                            elapsed: this.stats.getElapsedSeconds(),
                            stars: this.stats.getStarRating(this.drill.starThresholds),
                        },
                        completed,
                    });
                }
            });
        });
    }

    // ─── Sound helper ──────────────────────────────────────────────

    _playSound(key) {
        try {
            if (this.cache.audio.has(key)) {
                const audioCtx = this.sound.context;
                const buffer = this.cache.audio.get(key);
                // Handle both raw buffers and Phaser audio cache entries
                const audioBuffer = buffer.buffer || buffer;
                if (audioBuffer instanceof AudioBuffer) {
                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    const gainNode = audioCtx.createGain();
                    gainNode.gain.value = 0.5;
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    source.start();
                }
            }
        } catch (e) {
            // Audio not available, silently ignore
        }
    }

    // ─── Update loop ───────────────────────────────────────────────

    update(time, delta) {
        if (this._paused) return;

        const H = this.scale.height;

        updateStarfield(this, delta);

        // Track missile toward alien
        if (this._activeMissile) {
            this._activeMissile.track(delta);
        }

        // Update current alien & check for escape
        if (this._currentAlien && this._currentAlien.alive) {
            this._currentAlien.update(time, delta);

            if (this._currentAlien.y > H + 20) {
                this._onAlienEscaped(this._currentAlien);
            }
        }
    }
}
