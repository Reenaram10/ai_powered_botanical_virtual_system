// Lightweight Reusable Rule-Based NLP Pipeline Engine for PlantAI

// 1. Dictionary of Irregular Lemmas
const IRREGULAR_LEMMAS = {
    'leaves': 'leaf',
    'dying': 'die',
    'watered': 'water',
    'watering': 'water',
    'misting': 'mist',
    'misted': 'mist',
    'repotted': 'repot',
    'repotting': 'repot',
    'fertilized': 'fertilize',
    'fertilizing': 'fertilize',
    'growing': 'grow',
    'bought': 'buy',
    'drooping': 'droop',
    'curling': 'curl',
    'yellowing': 'yellow',
    'browning': 'brown',
    'spots': 'spot',
    'specks': 'speck',
    'bugs': 'bug',
    'mealybugs': 'mealybug',
    'roots': 'root',
    'stems': 'stem',
    'pots': 'pot',
    'windows': 'window',
    'plants': 'plant',
    'roses': 'rose'
};

// 2. Domain Dictionaries for Named Entity Recognition (NER)
const NER_DICTIONARIES = {
    PLANT_NAME: [
        'rose', 'roses', 'rose plant', 'jasmine', 'hibiscus', 'marigold', 'lavender', 'mint', 'basil',
        'tulip', 'orchid', 'money plant', 'jade plant', 'bamboo', 'bonsai', 'cactus', 'succulent',
        'fern', 'begonia', 'aloe', 'aloe vera', 'pothos', 'golden pothos', 'peace lily', 'calathea',
        'monstera', 'monstera deliciosa', 'snake plant', 'sansevieria', 'fiddle leaf fig', 'fiddle leaf',
        'zz plant', 'philodendron'
    ],
    PLANT_PART: [
        'leaf', 'leaves', 'stem', 'stems', 'root', 'roots', 'soil', 'pot', 'tip', 'tips',
        'margin', 'flower', 'bloom', 'blooms', 'petal', 'petals', 'foliage', 'branch', 'fenestration', 'fenestrations', 'topsoil'
    ],
    SYMPTOM: [
        'yellowing', 'yellow', 'brown', 'brown spots', 'crispy', 'wilting', 'droopy', 'drooping',
        'rotted', 'root rot', 'bugs', 'mealybug', 'mealybugs', 'white specks', 'curl', 'curling',
        'dry', 'mold', 'fungus', 'pale', 'scorched', 'burned', 'pest', 'pests', 'black spots', 'aphids'
    ],
    ENVIRONMENTAL: [
        'sunlight', 'sun', 'light', 'humidity', 'temperature', 'draft', 'drafts', 'window',
        'shade', 'water', 'moisture', 'fertilizer', 'compost', 'air conditioning', 'ac', 'outdoor', 'indoor'
    ],
    CARE_ACTION: [
        'water', 'watering', 'mist', 'misting', 'prune', 'pruning', 'repot', 'repotting',
        'fertilize', 'fertilizing', 'clean', 'wipe', 'feed', 'feedings', 'soak', 'care', 'tips', 'grow', 'growing', 'maintenance'
    ]
};

// POS Keyword Heuristics
const COMMON_DETS = new Set(['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'its', 'some']);
const COMMON_PRONS = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'what', 'how']);
const COMMON_ADPS = new Set(['in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'of', 'about', 'under', 'over']);
const COMMON_CONJS = new Set(['and', 'but', 'or', 'so', 'because', 'if', 'when']);
const COMMON_VERBS = new Set(['is', 'are', 'was', 'were', 'am', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'should', 'can', 'could', 'will', 'would', 'help', 'give', 'show']);

// Helper: Lemmatize single word
export function lemmatizeWord(word) {
    const lower = word.toLowerCase();
    if (IRREGULAR_LEMMAS[lower]) return IRREGULAR_LEMMAS[lower];

    if (lower.endsWith('ies') && lower.length > 4) return lower.slice(0, -3) + 'y';
    if (lower.endsWith('ing') && lower.length > 4) return lower.slice(0, -3);
    if (lower.endsWith('ed') && lower.length > 4) return lower.slice(0, -2);
    if (lower.endsWith('es') && lower.length > 4) return lower.slice(0, -2);
    if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 3) return lower.slice(0, -1);

    return lower;
}

// 1. TOKENIZER
export function tokenizeText(text) {
    if (!text) return [];
    const regex = /[A-Za-z0-9'-]+|[^\sA-Za-z0-9'-]/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(m => m[0]);
}

// 2. LEMMATIZER
export function lemmatizeTokens(tokens) {
    return tokens.map(token => ({
        word: token,
        lemma: /^[A-Za-z]+$/.test(token) ? lemmatizeWord(token) : token
    }));
}

// 3. POS TAGGER
export function posTagTokens(tokens) {
    return tokens.map(token => {
        const lower = token.toLowerCase();
        let tag = 'NOUN';
        let color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200';

        if (/^[^\w\s]$/.test(token)) {
            tag = 'PUNCT';
            color = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        } else if (/^\d+$/.test(token)) {
            tag = 'NUM';
            color = 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200';
        } else if (COMMON_DETS.has(lower)) {
            tag = 'DET';
            color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200';
        } else if (COMMON_PRONS.has(lower)) {
            tag = 'PRON';
            color = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200';
        } else if (COMMON_ADPS.has(lower)) {
            tag = 'ADP';
            color = 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200';
        } else if (COMMON_CONJS.has(lower)) {
            tag = 'CONJ';
            color = 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200';
        } else if (COMMON_VERBS.has(lower) || lower.endsWith('ing') || lower.endsWith('ed')) {
            tag = 'VERB';
            color = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200';
        } else if (lower.endsWith('ful') || lower.endsWith('ous') || lower.endsWith('al') || lower.endsWith('y') || lower.endsWith('ic')) {
            tag = 'ADJ';
            color = 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200';
        } else if (lower.endsWith('ly')) {
            tag = 'ADV';
            color = 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200';
        }

        return { word: token, tag, color };
    });
}

// 4. NAMED ENTITY RECOGNITION (NER)
export function extractNamedEntities(text) {
    if (!text) return [];
    const textLower = text.toLowerCase();
    const entities = [];

    const typeConfig = {
        PLANT_NAME: { label: 'Plant Species', color: 'bg-emerald-500 text-white' },
        PLANT_PART: { label: 'Plant Organ', color: 'bg-teal-500 text-white' },
        SYMPTOM: { label: 'Health Symptom', color: 'bg-rose-500 text-white' },
        ENVIRONMENTAL: { label: 'Environment Factor', color: 'bg-amber-500 text-white' },
        CARE_ACTION: { label: 'Care Action', color: 'bg-blue-500 text-white' }
    };

    Object.entries(NER_DICTIONARIES).forEach(([entityType, phraseList]) => {
        phraseList.forEach(phrase => {
            const idx = textLower.indexOf(phrase);
            if (idx !== -1) {
                const alreadyFound = entities.some(e => e.start === idx && e.text.length >= phrase.length);
                if (!alreadyFound) {
                    entities.push({
                        text: text.substr(idx, phrase.length),
                        entityType,
                        label: typeConfig[entityType].label,
                        color: typeConfig[entityType].color,
                        start: idx,
                        end: idx + phrase.length
                    });
                }
            }
        });
    });

    return entities.sort((a, b) => a.start - b.start);
}

// 5. INTENT CLASSIFICATION
export function classifyIntent(text, entities = []) {
    const textLower = (text || '').toLowerCase();

    const symptomCount = entities.filter(e => e.entityType === 'SYMPTOM').length;
    const actionCount = entities.filter(e => e.entityType === 'CARE_ACTION').length;
    const plantNameCount = entities.filter(e => e.entityType === 'PLANT_NAME').length;

    if (textLower.includes('identify') || textLower.includes('what plant') || textLower.includes('scan') || textLower.includes('photo') || textLower.includes('species')) {
        return {
            intent: 'Identification',
            confidence: 94.5,
            rationale: 'High keyword density for species identification & visual recognition.'
        };
    }

    if (symptomCount > 0 || textLower.includes('sick') || textLower.includes('dying') || textLower.includes('rot') || textLower.includes('spot') || textLower.includes('yellow') || textLower.includes('brown')) {
        return {
            intent: 'Diagnosis',
            confidence: 96.2,
            rationale: `Detected ${symptomCount} plant symptom entities (discoloration / tissue damage).`
        };
    }

    if (actionCount > 0 || plantNameCount > 0 || textLower.includes('water') || textLower.includes('light') || textLower.includes('fertiliz') || textLower.includes('repot') || textLower.includes('how often') || textLower.includes('care') || textLower.includes('tip') || textLower.includes('grow')) {
        return {
            intent: 'Care Advice',
            confidence: 93.5,
            rationale: 'Triggered by plant species, maintenance actions, or care guide query.'
        };
    }

    return {
        intent: 'General Chit-chat',
        confidence: 88.0,
        rationale: 'Greeting, conversational query, or general plant parenting question.'
    };
}

// 6. SENTIMENT & URGENCY DETECTION
export function detectUrgency(text, entities = []) {
    const textLower = (text || '').toLowerCase();
    const symptomEntities = entities.filter(e => e.entityType === 'SYMPTOM');

    let score = 20;
    let explanation = 'Routine query; no acute plant health hazard detected.';
    let level = 'Low';
    let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300';

    if (textLower.includes('dying') || textLower.includes('rot') || textLower.includes('emergency') || textLower.includes('severely') || textLower.includes('help fast') || textLower.includes('critical')) {
        score = 90;
        level = 'High';
        explanation = 'Urgent plant distress flags detected (root rot, dying leaves, or severe collapse).';
        badgeColor = 'bg-rose-500 text-white shadow-md shadow-rose-500/30';
    } else if (symptomEntities.length > 0 || textLower.includes('yellow') || textLower.includes('brown') || textLower.includes('spots') || textLower.includes('curl')) {
        score = 65;
        level = 'Medium';
        explanation = 'Moderate health issue detected. Requires leaf scan or watering adjustment within 24 hours.';
        badgeColor = 'bg-amber-500 text-white shadow-md shadow-amber-500/30';
    }

    return { level, score, explanation, badgeColor };
}

// 7. FULL UNIFIED PIPELINE RUNNER
export function runNlpPipeline(text) {
    const tokens = tokenizeText(text);
    const lemmatized = lemmatizeTokens(tokens);
    const posTagged = posTagTokens(tokens);
    const entities = extractNamedEntities(text);
    const intentInfo = classifyIntent(text, entities);
    const urgencyInfo = detectUrgency(text, entities);

    return {
        rawText: text,
        tokens,
        tokenCount: tokens.length,
        lemmatized,
        posTagged,
        entities,
        entityCount: entities.length,
        intent: intentInfo.intent,
        intentConfidence: intentInfo.confidence,
        intentRationale: intentInfo.rationale,
        urgency: urgencyInfo.level,
        urgencyScore: urgencyInfo.score,
        urgencyExplanation: urgencyInfo.explanation,
        urgencyBadgeColor: urgencyInfo.badgeColor,
        pipelineSteps: [
            { step: 1, name: 'String Tokenization', status: 'Completed', detail: `${tokens.length} tokens extracted` },
            { step: 2, name: 'Lemmatization & Normalization', status: 'Completed', detail: 'Suffix stripping + Irregular dict' },
            { step: 3, name: 'POS Heuristic Tagging', status: 'Completed', detail: '8 grammatical tags applied' },
            { step: 4, name: 'Named Entity Recognition (NER)', status: 'Completed', detail: `${entities.length} botanical entities matched` },
            { step: 5, name: 'Intent Classification Engine', status: 'Completed', detail: `Classified as ${intentInfo.intent} (${intentInfo.confidence}%)` },
            { step: 6, name: 'Urgency & Risk Evaluation', status: 'Completed', detail: `Risk level: ${urgencyInfo.level}` }
        ]
    };
}
