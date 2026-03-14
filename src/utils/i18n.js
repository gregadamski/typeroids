/**
 * Lightweight i18n module for Typeroids.
 * Supports English (en) and Polish (pl).
 */

const STORAGE_KEY = 'typeroids-language';

/** Available languages. */
export const LANGUAGES = {
    EN: 'en',
    PL: 'pl',
};

/** All translation strings keyed by language → key. */
const TRANSLATIONS = {
    en: {
        // Menu
        'menu.title': 'TYPEROIDS',
        'menu.subtitle': 'Defend Earth with your typing skills!',
        'menu.selectDrill': '━━━ SELECT DRILL ━━━',
        'menu.footer': '↑↓ Navigate   ENTER Start',

        // Drill names
        'drill.home-row-left': 'Home Row – Left',
        'drill.home-row-right': 'Home Row – Right',
        'drill.home-row-full': 'Full Home Row',
        'drill.top-row': 'Top Row',
        'drill.bottom-row': 'Bottom Row',
        'drill.all-letters': 'All Letters',
        'drill.numbers': 'Numbers',
        'drill.mixed': 'Letters & Numbers',

        // HUD
        'hud.score': 'SCORE',
        'hud.combo': 'COMBO',

        // Pause
        'pause.title': 'PAUSED',
        'pause.hint': 'Press ESC to resume',

        // Game Over
        'gameover.complete': 'DRILL COMPLETE!',
        'gameover.over': 'GAME OVER',
        'gameover.score': 'SCORE',
        'gameover.accuracy': 'Accuracy',
        'gameover.wpm': 'WPM',
        'gameover.aliensHit': 'Aliens Hit',
        'gameover.missedKeys': 'Missed Keys',
        'gameover.escaped': 'Escaped',
        'gameover.time': 'Time',
        'gameover.playAgain': 'PLAY AGAIN',
        'gameover.menu': 'MENU',
    },
    pl: {
        // Menu
        'menu.title': 'TYPEROIDS',
        'menu.subtitle': 'Broń Ziemi swoimi umiejętnościami pisania!',
        'menu.selectDrill': '━━━ WYBIERZ ĆWICZENIE ━━━',
        'menu.footer': '↑↓ Nawiguj   ENTER Start',

        // Drill names
        'drill.home-row-left': 'Rząd Bazowy – Lewa',
        'drill.home-row-right': 'Rząd Bazowy – Prawa',
        'drill.home-row-full': 'Cały Rząd Bazowy',
        'drill.top-row': 'Górny Rząd',
        'drill.bottom-row': 'Dolny Rząd',
        'drill.all-letters': 'Wszystkie Litery',
        'drill.numbers': 'Cyfry',
        'drill.mixed': 'Litery i Cyfry',

        // HUD
        'hud.score': 'WYNIK',
        'hud.combo': 'COMBO',

        // Pause
        'pause.title': 'PAUZA',
        'pause.hint': 'Wciśnij ESC aby wrócić',

        // Game Over
        'gameover.complete': 'ĆWICZENIE UKOŃCZONE!',
        'gameover.over': 'KONIEC GRY',
        'gameover.score': 'WYNIK',
        'gameover.accuracy': 'Celność',
        'gameover.wpm': 'SŁ/MIN',
        'gameover.aliensHit': 'Trafione',
        'gameover.missedKeys': 'Błędne Klawisze',
        'gameover.escaped': 'Uciekły',
        'gameover.time': 'Czas',
        'gameover.playAgain': 'JESZCZE RAZ',
        'gameover.menu': 'MENU',
    },
};

let _currentLanguage = localStorage.getItem(STORAGE_KEY) || LANGUAGES.EN;

/**
 * Get the current language code.
 * @returns {'en'|'pl'}
 */
export function getLanguage() {
    return _currentLanguage;
}

/**
 * Set the current language and persist to localStorage.
 * @param {'en'|'pl'} lang
 */
export function setLanguage(lang) {
    _currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
}

/**
 * Translate a key using the current language.
 * Returns the key itself if no translation is found.
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
    const dict = TRANSLATIONS[_currentLanguage] || TRANSLATIONS.en;
    return dict[key] ?? TRANSLATIONS.en[key] ?? key;
}

/**
 * Get the translated drill name by drill ID.
 * @param {string} drillId
 * @returns {string}
 */
export function drillName(drillId) {
    return t('drill.' + drillId);
}
