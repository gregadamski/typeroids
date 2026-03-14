/**
 * Word generator for Typeroids.
 * Provides words filtered to only use letters in a drill's key set.
 * Supports English and Polish word banks.
 */

import { getLanguage, LANGUAGES } from './i18n.js';

/** Curated bank of common short English words. */
const WORD_BANK_EN = [
    // 2-letter
    'ad', 'ah', 'am', 'an', 'as', 'at', 'ax', 'be', 'by', 'do',
    'go', 'ha', 'he', 'hi', 'if', 'in', 'is', 'it', 'la', 'lo',
    'ma', 'me', 'my', 'no', 'of', 'oh', 'ok', 'on', 'or', 'ox',
    'so', 'to', 'up', 'us', 'we',
    // 3-letter
    'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all',
    'and', 'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art',
    'ash', 'ask', 'ate', 'awe', 'axe', 'bad', 'bag', 'ban', 'bar',
    'bat', 'bed', 'big', 'bit', 'bow', 'box', 'boy', 'bud', 'bug',
    'bus', 'but', 'buy', 'cab', 'can', 'cap', 'car', 'cat', 'cop',
    'cow', 'cry', 'cup', 'cut', 'dad', 'dam', 'day', 'dew', 'did',
    'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dug', 'dye', 'ear',
    'eat', 'egg', 'elm', 'end', 'era', 'eve', 'eye', 'fan', 'far',
    'fat', 'fed', 'few', 'fig', 'fin', 'fit', 'fix', 'fly', 'fog',
    'for', 'fox', 'fun', 'fur', 'gag', 'gap', 'gas', 'gel', 'gem',
    'get', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym', 'had',
    'ham', 'has', 'hat', 'hay', 'hen', 'her', 'hid', 'him', 'hip',
    'his', 'hit', 'hog', 'hop', 'hot', 'how', 'hub', 'hug', 'hum',
    'hut', 'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'ire',
    'ivy', 'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig',
    'job', 'jog', 'joy', 'jug', 'key', 'kid', 'kin', 'kit', 'lab',
    'lad', 'lag', 'lap', 'law', 'lay', 'led', 'leg', 'let', 'lid',
    'lie', 'lip', 'lit', 'log', 'lot', 'low', 'lug', 'mad', 'man',
    'map', 'mat', 'max', 'may', 'men', 'met', 'mid', 'mix', 'mob',
    'mom', 'mop', 'mow', 'mud', 'mug', 'nag', 'nap', 'net', 'new',
    'nil', 'nip', 'nod', 'nor', 'not', 'now', 'nut', 'oak', 'oar',
    'oat', 'odd', 'off', 'oft', 'oil', 'old', 'one', 'opt', 'orb',
    'ore', 'our', 'out', 'owe', 'owl', 'own', 'pad', 'pal', 'pan',
    'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'per', 'pet', 'pie',
    'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pow', 'pro',
    'pub', 'pug', 'pun', 'pup', 'put', 'rag', 'ram', 'ran', 'rap',
    'rat', 'raw', 'ray', 'red', 'ref', 'rib', 'rid', 'rig', 'rim',
    'rip', 'rob', 'rod', 'rot', 'row', 'rub', 'rug', 'rum', 'run',
    'rut', 'sack', 'sad', 'sag', 'sap', 'sat', 'saw', 'say', 'sea',
    'set', 'sew', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six',
    'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sow',
    'soy', 'spa', 'spy', 'sub', 'sue', 'sum', 'sun', 'sup', 'tab',
    'tag', 'tan', 'tap', 'tar', 'tax', 'tea', 'ten', 'the', 'tie',
    'tin', 'tip', 'toe', 'ton', 'too', 'top', 'tow', 'toy', 'try',
    'tub', 'tug', 'two', 'urn', 'use', 'van', 'vat', 'vet', 'via',
    'vow', 'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wet',
    'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo',
    'wow', 'yak', 'yam', 'yap', 'yaw', 'yea', 'yes', 'yet', 'yew',
    'you', 'zap', 'zen', 'zip', 'zoo',
    // 4-letter
    'able', 'ache', 'acid', 'aged', 'also', 'arch', 'area', 'army',
    'asks', 'axle', 'back', 'bake', 'bald', 'ball', 'band', 'bang',
    'bank', 'bark', 'barn', 'base', 'bath', 'bead', 'beak', 'beam',
    'bear', 'beat', 'been', 'bell', 'belt', 'bend', 'best', 'bike',
    'bill', 'bind', 'bird', 'bite', 'blow', 'blue', 'blur', 'boat',
    'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boot', 'bore',
    'born', 'boss', 'both', 'bowl', 'bulk', 'bull', 'bump', 'burn',
    'bury', 'bush', 'busy', 'buzz', 'cafe', 'cage', 'cake', 'calm',
    'came', 'camp', 'cape', 'card', 'care', 'cart', 'case', 'cash',
    'cast', 'cave', 'cell', 'chat', 'chin', 'chip', 'chop', 'city',
    'clad', 'clam', 'clap', 'claw', 'clay', 'clip', 'club', 'clue',
    'coal', 'coat', 'code', 'coil', 'coin', 'cold', 'come', 'cone',
    'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'cork', 'corn',
    'cost', 'cozy', 'crab', 'crew', 'crop', 'crow', 'cube', 'cure',
    'curl', 'dale', 'damp', 'dare', 'dark', 'dart', 'dash', 'data',
    'dawn', 'dead', 'deaf', 'deal', 'dear', 'debt', 'deck', 'deed',
    'deem', 'deep', 'deer', 'deny', 'desk', 'dial', 'dice', 'diet',
    'dirt', 'disc', 'dish', 'disk', 'dock', 'does', 'dome', 'done',
    'doom', 'door', 'dose', 'down', 'drag', 'draw', 'drew', 'drip',
    'drop', 'drum', 'dual', 'duel', 'dull', 'dumb', 'dump', 'dune',
    'dusk', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy',
    'edge', 'edit', 'else', 'emit', 'epic', 'even', 'ever', 'evil',
    'exam', 'exit', 'face', 'fact', 'fade', 'fail', 'fair', 'fake',
    'fall', 'fame', 'fang', 'fare', 'farm', 'fast', 'fate', 'fear',
    'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fern', 'file',
    'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist',
    'flag', 'flap', 'flat', 'flaw', 'fled', 'flew', 'flip', 'flog',
    'flow', 'foam', 'fold', 'folk', 'fond', 'font', 'food', 'fool',
    'foot', 'ford', 'fork', 'form', 'fort', 'foul', 'four', 'free',
    'frog', 'from', 'fuel', 'full', 'fund', 'fuse', 'fury', 'fuzz',
    'gain', 'gale', 'game', 'gang', 'gape', 'garb', 'gate', 'gave',
    'gaze', 'gear', 'gift', 'gild', 'girl', 'gist', 'give', 'glad',
    'glow', 'glue', 'glum', 'gnaw', 'goal', 'goat', 'goes', 'gold',
    'golf', 'gone', 'good', 'grab', 'gran', 'gray', 'grew', 'grid',
    'grim', 'grin', 'grip', 'grit', 'grow', 'gulf', 'gust', 'guts',
    'hack', 'hail', 'hair', 'half', 'hall', 'halt', 'hand', 'hang',
    'hard', 'hare', 'harm', 'harp', 'hash', 'haste','hate', 'haul',
    'have', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat',
    'heel', 'held', 'hell', 'helm', 'help', 'herb', 'herd', 'here',
    'hero', 'hide', 'high', 'hike', 'hill', 'hind', 'hint', 'hire',
    'hold', 'hole', 'home', 'hood', 'hook', 'hope', 'horn', 'host',
    'huge', 'hull', 'hung', 'hunt', 'hurl', 'hurt', 'hush', 'hymn',
    'idea', 'idle', 'inch', 'into', 'iron', 'isle', 'item', 'jack',
    'jade', 'jail', 'jazz', 'jerk', 'jest', 'jobs', 'join', 'joke',
    'jolt', 'jump', 'june', 'jury', 'just', 'keen', 'keep', 'kept',
    'kick', 'kill', 'kind', 'king', 'kiss', 'kite', 'knob', 'knot',
    'know', 'lace', 'lack', 'laid', 'lake', 'lamb', 'lame', 'lamp',
    'land', 'lane', 'laps', 'last', 'late', 'lawn', 'lead', 'leaf',
    'leak', 'lean', 'leap', 'left', 'lend', 'lens', 'less', 'lick',
    'lift', 'like', 'limb', 'lime', 'limp', 'line', 'link', 'lion',
    'list', 'live', 'load', 'loaf', 'loan', 'lock', 'loft', 'long',
    'look', 'loop', 'lord', 'lore', 'lose', 'loss', 'lost', 'loud',
    'love', 'luck', 'lump', 'lung', 'lure', 'lurk', 'lush', 'made',
    'mail', 'main', 'make', 'male', 'mall', 'malt', 'mane', 'many',
    'mare', 'mark', 'mask', 'mass', 'mast', 'mate', 'maze', 'meal',
    'mean', 'meat', 'meet', 'meld', 'melt', 'memo', 'mend', 'menu',
    'mere', 'mesh', 'mess', 'mild', 'milk', 'mill', 'mind', 'mine',
    'mint', 'miss', 'mist', 'moan', 'moat', 'mock', 'mode', 'mold',
    'mole', 'mood', 'moon', 'moor', 'more', 'moss', 'most', 'moth',
    'move', 'much', 'mule', 'muse', 'mush', 'must', 'mute', 'myth',
    'nail', 'name', 'nape', 'nave', 'near', 'neat', 'neck', 'need',
    'nest', 'next', 'nice', 'nine', 'node', 'none', 'noon', 'norm',
    'nose', 'note', 'noun', 'nude', 'numb',
    // 5-letter
    'deals', 'flash', 'glass', 'grasp', 'leash', 'shall', 'slash',
    'small', 'smart', 'snail', 'stalk', 'stand', 'start', 'steam',
    'steel', 'steep', 'stern', 'stick', 'still', 'stock', 'stomp',
    'stone', 'stood', 'stool', 'store', 'storm', 'stove', 'straw',
    'strip', 'stuck', 'stuff', 'stump', 'stung', 'stunk', 'sweep',
    'sweet', 'swift', 'swing', 'swirl', 'sword', 'swore', 'swung',
    'table', 'taken', 'taste', 'teach', 'teeth', 'thank', 'thick',
    'thing', 'think', 'thorn', 'those', 'three', 'threw', 'throw',
    'thumb', 'tiger', 'tight', 'toast', 'today', 'total', 'touch',
    'tower', 'track', 'trade', 'trail', 'train', 'treat', 'trend',
    'trial', 'tribe', 'trick', 'tried', 'truck', 'truly', 'trunk',
    'trust', 'truth', 'twist', 'under', 'unity', 'until', 'upper',
    'urban', 'usage', 'usual', 'valid', 'value', 'vault', 'vigor',
    'viral', 'visit', 'vital', 'vivid', 'vocal', 'voice', 'voter',
    'wagon', 'waste', 'watch', 'water', 'weave', 'weird', 'wheat',
    'wheel', 'where', 'which', 'while', 'white', 'whole', 'wider',
    'witch', 'woman', 'world', 'worry', 'worse', 'worst', 'worth',
    'would', 'wound', 'wrath', 'write', 'wrong', 'wrote', 'yield',
    'young', 'youth',
];

/**
 * Curated bank of common short Polish words (no diacritics – a-z only).
 * This keeps them compatible with the standard keyboard key sets.
 */
const WORD_BANK_PL = [
    // 2-letter
    'bo', 'by', 'co', 'do', 'go', 'ja', 'je', 'ku', 'ma', 'mi',
    'na', 'ni', 'no', 'nu', 'od', 'on', 'po', 'se', 'ta', 'te',
    'to', 'tu', 'ty', 'we', 'za',
    // 3-letter
    'ale', 'ani', 'bok', 'but', 'cel', 'dam', 'dar', 'den', 'dom',
    'dno', 'dwa', 'dwu', 'elf', 'era', 'fal', 'fan', 'far', 'fat',
    'fil', 'fok', 'gar', 'gen', 'gol', 'gra', 'grb', 'gut', 'hen',
    'hit', 'hop', 'huk', 'ile', 'jak', 'jar', 'jod', 'kam', 'kat',
    'kit', 'kij', 'koc', 'kod', 'kok', 'kon', 'kos', 'kot', 'kra',
    'kto', 'kum', 'kur', 'las', 'led', 'lek', 'les', 'lew', 'lis',
    'los', 'lot', 'lud', 'luk', 'lut', 'mat', 'med', 'men', 'mer',
    'mit', 'moc', 'mor', 'mur', 'mus', 'mur', 'myk', 'nam', 'nas',
    'nit', 'nos', 'noc', 'nos', 'noz', 'nud', 'nut', 'oko', 'pal',
    'pan', 'par', 'pas', 'pat', 'pes', 'pic', 'pik', 'pin', 'pod',
    'pol', 'pot', 'pro', 'psa', 'pud', 'puk', 'rad', 'raj', 'rak',
    'ram', 'ran', 'rap', 'raz', 'rog', 'rok', 'ros', 'row', 'rud',
    'rum', 'rys', 'sad', 'sal', 'sam', 'ser', 'set', 'sit', 'ski',
    'sol', 'som', 'son', 'sos', 'sow', 'sok', 'sum', 'sun', 'sur',
    'syn', 'tak', 'tam', 'tan', 'tor', 'ton', 'top', 'tuk', 'tur',
    'tuz', 'typ', 'wam', 'war', 'was', 'wek', 'wer', 'wir', 'wit',
    'wok', 'wol', 'wor', 'wuj', 'wyk', 'zad', 'zan', 'zar', 'zip',
    // 4-letter
    'auto', 'baba', 'bank', 'bark', 'bieg', 'blok', 'brat', 'bruk',
    'bunt', 'burk', 'cela', 'cena', 'cham', 'chat', 'cios', 'cudo',
    'dach', 'dane', 'deska','diak', 'dola', 'drab', 'druk', 'duma',
    'echo', 'efek', 'etap', 'fakt', 'fala', 'farm', 'film', 'foka',
    'fort', 'gama', 'glob', 'gnom', 'golf', 'gong', 'grad', 'gram',
    'grom', 'grub', 'gust', 'haft', 'hala', 'helm', 'herb', 'gest',
    'hurt', 'igla', 'ilom', 'jard', 'jajo', 'jutk', 'kara', 'karp',
    'kask', 'klan', 'klej', 'klif', 'klub', 'klur', 'koks', 'kora',
    'kord', 'krem', 'kres', 'kret', 'krok', 'krol', 'kron', 'krup',
    'kura', 'kurs', 'kula', 'kwas', 'lada', 'lama', 'lamp', 'lato',
    'lawa', 'liga', 'lipa', 'list', 'loch', 'lont', 'lord', 'lufa',
    'mapa', 'marg', 'masz', 'mech', 'mewa', 'mild', 'mina', 'misa',
    'most', 'mops', 'mrok', 'mula', 'nard', 'noga', 'nota', 'nora',
    'nurt', 'obca', 'okno', 'okop', 'olin', 'opis', 'orka', 'oset',
    'owca', 'pakt', 'park', 'plan', 'plac', 'plot', 'plus', 'plon',
    'port', 'post', 'prof', 'prom', 'prut', 'ptak', 'rafa', 'rana',
    'ring', 'rola', 'rosa', 'ruch', 'rudo', 'rura', 'ryba', 'skok',
    'slab', 'smak', 'snop', 'spis', 'staw', 'stop', 'stuk', 'takt',
    'tank', 'targ', 'test', 'tlen', 'tolt', 'torf', 'tram', 'trop',
    'trut', 'trup', 'udar', 'ulga', 'umor', 'upal', 'usta', 'wasp',
    'waga', 'wart', 'wata', 'wilk', 'wina', 'witr', 'wolt', 'woda',
    'wrak', 'wzor', 'zamk', 'znak', 'zwod',
    // 5-letter
    'adres', 'alarm', 'atlas', 'balon', 'barka', 'bilet', 'blask',
    'broda', 'brzeg', 'budka', 'domek', 'droga', 'drzwi', 'farad',
    'farba', 'forma', 'front', 'garsc', 'gleba', 'gniew', 'grosz',
    'grupo', 'haslo', 'hotel', 'iskra', 'kabel', 'karta', 'klasa',
    'klips', 'kolor', 'komin', 'konik', 'koper', 'kresk', 'krokw',
    'krzew', 'latka', 'linia', 'maska', 'medal', 'melon', 'metal',
    'mleko', 'model', 'motor', 'motyl', 'mulat', 'narod', 'numer',
    'obiad', 'obraz', 'oliwa', 'opona', 'osoba', 'pagod', 'panel',
    'patyk', 'peron', 'pilot', 'pirat', 'plama', 'podla', 'pokrm',
    'polar', 'prasa', 'promt', 'punkt', 'radio', 'ranek', 'regal',
    'robot', 'salon', 'serce', 'skala', 'skarb', 'sport', 'stawy',
    'stres', 'super', 'tabor', 'temat', 'trawa', 'twarz', 'uklad',
    'wagon', 'wirus', 'wisla', 'wpust', 'wulka', 'wynik', 'zamek',
    'zimno', 'zloto', 'zmrok',
];

/** Map language codes to their word banks. */
const WORD_BANKS = {
    en: WORD_BANK_EN,
    pl: WORD_BANK_PL,
};

/** Minimum number of candidate words required before augmenting with English. */
const MIN_CANDIDATES = 2;

/**
 * Return a random word from the bank whose letters are all contained in `keys`.
 * When the selected language yields fewer than MIN_CANDIDATES words, English
 * words are added to the pool so every drill has enough variety.
 * @param {string[]} keys - Allowed characters for this drill
 * @param {number} minLen - Minimum word length (inclusive)
 * @param {number} maxLen - Maximum word length (inclusive)
 * @param {string} [language] - Language code ('en' or 'pl'); defaults to current i18n setting
 * @returns {string|null} A matching word, or null if none found
 */
export function getWordForKeys(keys, minLen = 2, maxLen = 5, language) {
    const lang = language || getLanguage();
    const bank = WORD_BANKS[lang] || WORD_BANKS.en;
    const keySet = new Set(keys.map(k => k.toLowerCase()));

    const filterFn = w =>
        w.length >= minLen &&
        w.length <= maxLen &&
        [...w].every(ch => keySet.has(ch));

    let candidates = bank.filter(filterFn);

    // If the chosen language has too few matches, augment with English words
    if (candidates.length < MIN_CANDIDATES && lang !== LANGUAGES.EN) {
        const enExtras = WORD_BANKS.en.filter(filterFn);
        // Merge without duplicates
        const existing = new Set(candidates);
        for (const w of enExtras) {
            if (!existing.has(w)) candidates.push(w);
        }
    }

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Generate a random string from the key set (fallback when no dictionary word fits).
 * @param {string[]} keys - Allowed characters
 * @param {number} length - Desired word length
 * @returns {string}
 */
export function generateRandomWord(keys, length) {
    let word = '';
    for (let i = 0; i < length; i++) {
        word += keys[Math.floor(Math.random() * keys.length)];
    }
    return word;
}

/**
 * Get a word (or single letter) for the current alien, respecting the drill config.
 * @param {object} drill - The drill configuration
 * @param {number} wordChance - Probability (0–1) that this alien gets a word
 * @param {number} minLen - Min word length
 * @param {number} maxLen - Max word length
 * @returns {string}
 */
export function pickAlienWord(drill, wordChance = 0.6, minLen = 2, maxLen = 5) {
    const keys = drill.keys;

    if (Math.random() < wordChance) {
        // Try dictionary word first (uses current language automatically)
        const word = getWordForKeys(keys, minLen, maxLen);
        if (word) return word;

        // Fallback: random string from key set
        const len = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
        return generateRandomWord(keys, len);
    }

    // Single letter
    return keys[Math.floor(Math.random() * keys.length)];
}
