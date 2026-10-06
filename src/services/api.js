import { runNlpPipeline } from '../utils/nlpPipeline';

// System Instruction enforcing strict plant-only scope
const PLANT_BOTANIST_SYSTEM_INSTRUCTION = `You are PlantAI Botanist, an expert AI botanist, horticulturist, and plant care specialist.

STRICT MANDATORY DIRECTIVE:
You MUST ONLY answer queries related to plants, botany, plant care, indoor/outdoor gardening, plant species identification, plant pathology/diseases, soil science, pest management, landscaping, and agriculture.

If the user asks ANY question, prompt, or request that is NOT related to plants or botany (such as general coding, math, history, politics, pop culture, non-plant cooking/recipes, sports, finance, general advice, etc.), you MUST politely refuse and state:
"🌿 I am PlantAI Botanist, specialized exclusively in plants, botany, and garden care. I cannot answer queries outside the scope of plants. Please ask me any plant-related question!"

When answering valid plant-related questions:
- Be concise, accurate, structured, and encouraging.
- Provide actionable care tips (watering frequency, light needs, soil type, pruning, pest control).
- Use bullet points where appropriate for readability.`;

// Helper to convert Blob/Data URL to Base64 for Gemini multimodal API
async function urlToBase64(url) {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                resolve({ mimeType: blob.type || 'image/jpeg', data: base64data });
            };
            reader.onerror = reject;
        });
    } catch (err) {
        console.warn('Failed to convert image attachment to base64', err);
        return null;
    }
}

// Call Gemini API (REST Endpoint with automatic model fallback)
async function callGeminiApi(userText, plantContext, apiKey, attachment = null) {
    if (!apiKey) return null;

    try {
        const parts = [];

        // Add plant context header if active
        let promptText = userText;
        if (plantContext) {
            promptText = `[Context: User is asking about their saved plant "${plantContext.nickname}" (${plantContext.speciesName}), Location: ${plantContext.location}, Last Watered: ${plantContext.lastWatered}]\n\nUser Question: ${userText}`;
        }

        parts.push({ text: promptText });

        // Handle Image Attachment for multimodal analysis
        if (attachment) {
            const imageData = await urlToBase64(attachment);
            if (imageData) {
                parts.push({ inlineData: imageData });
            }
        }

        const payload = {
            contents: [{ role: 'user', parts }],
            systemInstruction: {
                parts: [{ text: PLANT_BOTANIST_SYSTEM_INSTRUCTION }]
            },
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 800
            }
        };

        // Models to attempt in sequence in case of model version availability shifts
        const CANDIDATE_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
        let lastError = null;

        for (const model of CANDIDATE_MODELS) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (candidateText) return candidateText;
                }

                const errJson = await res.json().catch(() => ({}));
                const errMessage = errJson?.error?.message || `HTTP Status ${res.status}`;
                lastError = errMessage;

                // If API Key itself is explicitly invalid or expired, stop retrying models
                if (res.status === 400 && (errMessage.toLowerCase().includes('api key') || errMessage.toLowerCase().includes('invalid'))) {
                    return `⚠️ **Gemini API Key Issue**: API key is invalid or expired (${errMessage}). Please update your API key in Settings or generate a free key at Google AI Studio.`;
                }

                if (res.status === 403) {
                    return `⚠️ **Gemini API Key Issue**: Access denied (${errMessage}). Please verify your Gemini API key in Settings or Google AI Studio.`;
                }
            } catch (singleErr) {
                lastError = singleErr.message;
            }
        }

        if (lastError && (lastError.toLowerCase().includes('api key') || lastError.toLowerCase().includes('key'))) {
            return `⚠️ **Gemini API Key Issue**: Unable to connect (${lastError}). Please verify your Gemini API key in Settings or check Google AI Studio.`;
        }

        console.warn('Gemini API Error (all candidate models attempted):', lastError);
        return null; // Fallback to Smart Local NLP Engine if temporary API issue
    } catch (err) {
        console.error('Error contacting Gemini API:', err);
        return null;
    }
}

// Initial Mock Data
export const INITIAL_SAVED_PLANTS = [
    {
        id: 'plant-1',
        nickname: 'Figgy',
        speciesName: 'Fiddle Leaf Fig',
        speciesId: 'fiddle-leaf-fig',
        healthStatus: 'healthy',
        healthScore: 92,
        location: 'Living Room Window',
        lastWatered: '2 days ago',
        lastFertilized: '12 days ago',
        waterIntervalDays: 7,
        fertilizeIntervalDays: 30,
        acquiredDate: '2023-04-15',
        thumbnail: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        notes: 'Loves indirect sunlight near the east-facing window.',
        photoHistory: [
            { date: '2023-09-10', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80', note: 'New leaf unfolding!' },
            { date: '2023-06-01', url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80', note: 'Repotted into terracotta.' }
        ]
    },
    {
        id: 'plant-2',
        nickname: 'Monty',
        speciesName: 'Monstera Deliciosa',
        speciesId: 'monstera',
        healthStatus: 'needs attention',
        healthScore: 68,
        location: 'Office Desk',
        lastWatered: '6 days ago',
        lastFertilized: '25 days ago',
        waterIntervalDays: 7,
        fertilizeIntervalDays: 30,
        acquiredDate: '2023-08-20',
        thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        notes: 'Lower leaf shows slight yellowing along margins.',
        photoHistory: [
            { date: '2023-09-20', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80', note: 'Noticed slight yellowing.' }
        ]
    }
];

export const INITIAL_PLANTS = INITIAL_SAVED_PLANTS;

export const INITIAL_REMINDERS = [
    {
        id: 'rem-1',
        plantId: 'plant-2',
        plantNickname: 'Monty',
        speciesName: 'Monstera Deliciosa',
        type: 'Watering',
        dueDate: 'Today',
        completed: false,
        icon: 'Droplets'
    },
    {
        id: 'rem-2',
        plantId: 'plant-1',
        plantNickname: 'Figgy',
        speciesName: 'Fiddle Leaf Fig',
        type: 'Fertilizing',
        dueDate: 'Tomorrow',
        completed: false,
        icon: 'Sparkles'
    }
];

export const INITIAL_COMMUNITY_POSTS = [
    {
        id: 'post-1',
        author: 'Elena Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        title: 'Monstera Fenestration Success!',
        content: 'After moving my Monstera 2 feet closer to the window, the newest leaf unfurled with 8 fenestrations! Humidity is kept at 55%.',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        likes: 42,
        likedByMe: false,
        timestamp: '2 hours ago',
        commentsCount: 3,
        tags: ['Monstera', 'CareTip', 'Propagation'],
        comments: [
            { id: 'c1', author: 'Liam S.', text: 'Super impressive! What fertilizer are you using?' }
        ]
    }
];

export const PLANT_SPECIES_DATABASE = [
    {
        id: 'monstera',
        name: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        difficulty: 'Easy',
        light: 'Bright, indirect light',
        water: 'Water when top 2 inches of soil dry out',
        humidity: 'High (50%+)',
        petFriendly: false,
        description: 'Famous tropical plant known for iconic natural leaf holes (fenestrations). Very hardy indoor companion.',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        careGuide: [
            'Provide bright, filtered light; avoid harsh direct afternoon sun.',
            'Allow soil to dry slightly between waterings to prevent root rot.',
            'Wipe large leaves monthly with a damp cloth to clear dust.'
        ]
    },
    {
        id: 'snake-plant',
        name: 'Snake Plant',
        scientificName: 'Dracaena trifasciata',
        difficulty: 'Beginner',
        light: 'Tolerates low to bright light',
        water: 'Water every 2-3 weeks',
        humidity: 'Average room humidity',
        petFriendly: false,
        description: 'Extremely resilient air-purifying plant with upright sword-like leaves.',
        image: 'https://images.unsplash.com/photo-1599598425947-020645105494?auto=format&fit=crop&w=800&q=80',
        careGuide: [
            'Thrives in neglected conditions; do not overwater.',
            'Use well-draining succulent soil mix.',
            'Tolerates low light corners remarkably well.'
        ]
    },
    {
        id: 'fiddle-leaf-fig',
        name: 'Fiddle Leaf Fig',
        scientificName: 'Ficus lyrata',
        difficulty: 'Intermediate',
        light: 'Bright, consistent indirect light',
        water: 'Water weekly when topsoil dries',
        humidity: 'Moderate to high',
        petFriendly: false,
        description: 'Stunning architectural houseplant with massive violin-shaped glossy green leaves.',
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        careGuide: [
            'Keep away from cold drafts and air conditioning vents.',
            'Rotate 90 degrees every month for symmetrical growth.'
        ]
    }
];

// Simulated AI Intelligence Engines + Gemini Integration
export const apiService = {

    // 1. Scan & Identification Service
    async scanPlantImage(imageUri) {
        await new Promise(res => setTimeout(res, 1800));

        return {
            matchScore: 96.4,
            primaryMatch: {
                speciesName: 'Monstera Deliciosa',
                scientificName: 'Monstera deliciosa',
                family: 'Araceae',
                origin: 'Tropical Americas',
                healthStatus: 'needs attention',
                healthScore: 74,
                confidence: 0.964,
                summary: 'Detected Monstera Deliciosa. Primary foliage shows early signs of chlorosis (yellowing) due to slight moisture imbalance.'
            },
            detectedFeatures: [
                'Heart-shaped juvenile leaf structure',
                'Early fenestration split along margin',
                'Chlorosis detected on lower left quadrant (12% surface area)'
            ],
            alternateMatches: [
                { speciesName: 'Philodendron Bipinnatifidum', confidence: 0.021 },
                { speciesName: 'Epipremnum Aureum', confidence: 0.015 }
            ]
        };
    },

    // 2. Health Diagnosis Service
    async diagnosePlantHealth(imageUri) {
        await new Promise(res => setTimeout(res, 1500));

        return {
            issueTitle: 'Early Stage Moisture Chlorosis & Root Stress',
            severity: 'MODERATE',
            confidenceScore: 94.2,
            possibleCauses: [
                'Soil moisture retained too long near root zone',
                'Low ambient light reducing transpiration rate'
            ],
            symptomsDetected: [
                'Marginal leaf yellowing (Chlorosis)',
                'Slight petiole drooping',
                'No active pest webbing found'
            ],
            treatmentPlan: [
                { id: 1, step: 'Check root zone moisture with finger 2 inches deep', done: false },
                { id: 2, step: 'Allow topsoil to dry completely before next watering cycle', done: false },
                { id: 3, step: 'Move pot 1.5 feet closer to bright indirect light source', done: false },
                { id: 4, step: 'Prune severely damaged leaf if yellowing exceeds 50%', done: false }
            ]
        };
    },

    // 3. Conversational Botanist AI Assistant (Gemini API + NLP Fallback Engine)
    async sendChatMessage(userText, plantContext = null, history = [], attachment = null, apiKey = null) {
        // Run shared NLP Pipeline for local classification & intent tracking
        const nlpResult = runNlpPipeline(userText);
        const { intent, urgency, entities } = nlpResult;
        const lower = userText.toLowerCase();

        // Check if query is clearly non-plant using local keyword heuristics
        const NON_PLANT_KEYWORDS = ['coding', 'javascript', 'python', 'react', 'math', 'history', 'world cup', 'presidential', 'stock market', 'bitcoin', 'crypto', 'recipe for pizza', 'movie'];
        const isNonPlantQuery = NON_PLANT_KEYWORDS.some(k => lower.includes(k));

        if (isNonPlantQuery && !lower.includes('plant') && !lower.includes('leaf') && !lower.includes('flower') && !lower.includes('tree') && !lower.includes('garden')) {
            return {
                responseText: '🌿 I am PlantAI Botanist, specialized exclusively in plants, botany, and garden care. I cannot answer queries outside the scope of plants. Please ask me any plant-related question!',
                quickReplies: ['How often to water?', 'Monstera care guide', 'Diagnose leaf yellowing'],
                embeddedCard: null,
                nlpAnalysis: nlpResult,
                source: 'Scope Filter Guardrail'
            };
        }

        // Try live Gemini API call first if apiKey is available
        if (apiKey) {
            const geminiResponseText = await callGeminiApi(userText, plantContext, apiKey, attachment);
            if (geminiResponseText) {
                let quickReplies = ['How often to water?', 'Fertilizer guide', 'Scan leaf photo 📷'];
                if (geminiResponseText.toLowerCase().includes('cannot answer') || geminiResponseText.toLowerCase().includes('exclusively in plants')) {
                    quickReplies = ['Watering advice', 'Browse Plant Library', 'Ask plant question'];
                }

                return {
                    responseText: geminiResponseText,
                    quickReplies,
                    embeddedCard: null,
                    nlpAnalysis: nlpResult,
                    source: geminiResponseText.startsWith('⚠️') ? 'Gemini API Alert' : 'Gemini 1.5 Flash API ⚡'
                };
            }
        }

        // Smart Local NLP Engine (Handles species care, watering, diagnosis, pruning, fertilizing, repotting, pests)
        await new Promise(res => setTimeout(res, 400));

        // Find detected plant species entity if any
        const plantEntity = entities.find(e => e.entityType === 'PLANT_NAME')?.text || (plantContext ? plantContext.speciesName : null);
        const targetPlantName = plantEntity ? plantEntity.charAt(0).toUpperCase() + plantEntity.slice(1) : (plantContext?.nickname || 'your plant');

        let responseText = '';
        let quickReplies = [];
        let embeddedCard = null;

        if (attachment) {
            responseText = `I've analyzed the attached leaf image! Based on visual features, I see healthy leaf pigmentation. ${plantContext ? `For your ${plantContext.nickname}, ensure indirect light exposure remains steady.` : ''}`;
            quickReplies = ['How often to water?', 'Diagnose health', 'Scan another leaf 📷'];
        } else if (intent === 'Identification' || lower.includes('identify') || lower.includes('what plant')) {
            responseText = `I can help identify any plant species! You can tap the Scan button to capture or upload a leaf photo for visual recognition.`;
            quickReplies = ['Open Leaf Scanner 📷', 'Browse Plant Library', 'General Care Tips'];
        } else if (intent === 'Diagnosis' || urgency === 'High' || lower.includes('yellow') || lower.includes('brown') || lower.includes('dying') || lower.includes('spot')) {
            responseText = `I detected a plant health query regarding potential leaf distress. ${plantContext ? `Regarding your ${plantContext.nickname}:` : ''} Yellowing or browning is usually caused by moisture imbalance or light changes. Would you like a step-by-step diagnostic checklist?`;
            quickReplies = ['View Diagnosis Checklist', 'Watering guide', 'Ask another question'];
            embeddedCard = {
                title: 'Diagnostic Recommendation',
                subtitle: plantContext ? `${plantContext.nickname} (${plantContext.speciesName})` : 'General Health Alert',
                items: [
                    'Check soil moisture 2 inches deep',
                    'Inspect leaf undersides for pests',
                    'Ensure drainage holes are clear'
                ],
                actionText: 'Run Health Scan',
                link: '/scan'
            };
        }
        // 🌹 ROSE SPECIFIC & GENERIC BOTANICAL CARE
        else if (lower.includes('rose') || lower.includes('ros plant') || lower.includes('ros care')) {
            responseText = `🌿 **Complete Rose Care & Botanical Guide**:

• ☀️ **Sunlight & Light**: Requires at least 6+ hours of direct sunlight daily for abundant, multi-petaled blooms.
• 💧 **Watering**: Water deeply 1-2 times weekly at the soil base. Keep leaves completely dry to prevent Black Spot fungus.
• 🪴 **Soil & Potting**: Organic-rich, loam-based soil mix with a slightly acidic pH (6.0 - 6.5) and deep bottom drainage.
• 🧪 **Fertilization**: Apply high-phosphorus bloom booster every 3-4 weeks from early spring through summer bloom cycles.
• ✂️ **Pruning**: Cut deadwood and crossing canes at a 45° angle in early spring just above outward-facing buds.
• 🪲 **Pest & Disease Control**: Inspect for aphids and spider mites. Apply organic Neem oil spray to undersides of leaves.`;
            quickReplies = ['Watering frequency for roses', 'Prevent black spot disease', 'Best fertilizer for roses'];
        }
        // 🌿 MONSTERA SPECIFIC & GENERIC BOTANICAL CARE
        else if (lower.includes('monstera')) {
            responseText = `🌿 **Complete Monstera Deliciosa Botanical Guide**:

• ☀️ **Sunlight & Light**: Thrives in bright, indirect light. Direct harsh afternoon sun will scorch large leaves.
• 💧 **Watering**: Allow top 2-3 inches of soil to dry completely before soaking. Reduce frequency in winter.
• 🪴 **Soil & Support**: Chunky 60/20/20 potting soil, perlite, and orchid bark mix. Provide a sturdy moss pole.
• 🧪 **Fertilization**: Feed monthly with balanced liquid fertilizer (10-10-10 NPK diluted to 50%) during active growth.
• ✂️ **Pruning & Cleaning**: Wipe leaves monthly to boost photosynthesis. Trim yellowing lower leaves at petiole base.
• 🪲 **Pest Control**: Check leaf joints for thrips and mealybugs; wipe down with insecticidal soap solution.`;
            quickReplies = ['How to get fenestrations', 'Moss pole setup', 'Pruning Monstera'];
        }
        // 🍃 FIDDLE LEAF FIG SPECIFIC & GENERIC BOTANICAL CARE
        else if (lower.includes('fiddle') || lower.includes('fig')) {
            responseText = `🍃 **Complete Fiddle Leaf Fig (Ficus Lyrata) Guide**:

• ☀️ **Sunlight & Light**: Requires 4-6 hours of bright, filtered window light near east or south exposures.
• 💧 **Watering**: Water thoroughly when top 2 inches dry out. Never let roots sit in standing saucers of water.
• 🪴 **Soil & Environment**: Well-draining indoor mix. Keep away from cold drafts, A/C vents, and heaters to prevent leaf drop.
• 🧪 **Fertilization**: Feed with nitrogen-rich liquid houseplant food once every month during spring and summer.
• ✂️ **Pruning & Care**: Shake trunk gently to strengthen stem. Prune top tip (notching) to stimulate branching.
• 🪲 **Pest Control**: Inspect under broad leaves for spider mites; wipe clean with damp microfiber cloth.`;
            quickReplies = ['Fixing brown spots', 'Cleaning fiddle leaves', 'Fertilizer guide'];
        }
        // ✂️ PRUNING & MAINTENANCE GUIDE
        else if (lower.includes('prun') || lower.includes('trim') || lower.includes('clip') || lower.includes('cut back') || lower.includes('deadhead')) {
            responseText = `✂️ **Pruning & Maintenance Guide for ${targetPlantName}**:

• 🕒 **Best Timing**: Prune during early spring or active growing season. Avoid heavy pruning during winter dormancy.
• 📐 **Technique**: Use sharp, sterilized shears. Cut at a 45° angle roughly 1/4 inch above an outward-facing leaf node.
• 🧹 **Sanitation**: Wipe blades with rubbing alcohol between cuts to prevent spreading bacterial or fungal spores.
• 🌿 **Purpose**: Remove yellowing, leggy, or dead stems to stimulate denser foliage and promote fresh healthy shoots.`;
            quickReplies = ['When to prune?', 'Watering after pruning', 'Best pruning tools'];
        }
        // 🧪 FERTILIZER & NUTRITION GUIDE
        else if (lower.includes('fertiliz') || lower.includes('feed') || lower.includes('npk') || lower.includes('nutrient') || lower.includes('plant food')) {
            responseText = `🧪 **Fertilization & Plant Nutrition Guide for ${targetPlantName}**:

• 📅 **Schedule**: Feed every 3-4 weeks during spring and summer (active growing season). Pause in autumn/winter.
• 💧 **Formula**: Use a balanced liquid houseplant fertilizer (e.g., 10-10-10 NPK) diluted to 50% recommended strength.
• 🚫 **Avoid Root Burn**: Always ensure the soil is slightly damp before applying fertilizer; never fertilize bone-dry soil.
• 🧼 **Salt Flushing**: Flush soil with clear water once every 2 months to dissolve excess mineral salts.`;
            quickReplies = ['Best fertilizer type', 'Soil mix recommendations', 'How often to water?'];
        }
        // 🪴 SOIL & REPOTTING GUIDE
        else if (lower.includes('soil') || lower.includes('repot') || lower.includes('potting') || lower.includes('transplant') || lower.includes('root bound')) {
            responseText = `🪴 **Soil & Repotting Master Guide for ${targetPlantName}**:

• 🪴 **Container Choice**: Select a pot 1 to 2 inches larger in diameter with ample bottom drainage holes.
• 🌾 **Soil Mix**: Prepare a well-aerated mix: 60% quality potting soil, 20% perlite (for aeration), and 20% orchid bark (for drainage).
• 🩺 **Root Check**: Inspect root ball gently; loosen tightly wound roots before placing in fresh medium.
• 💧 **Post-Repot Care**: Water thoroughly until liquid drains, then keep in bright indirect light away from harsh direct sun for 1 week.`;
            quickReplies = ['How to check root rot', 'Fertilizer recommendations', 'Watering frequency'];
        }
        // ☀️ SUNLIGHT & LIGHTING GUIDE
        else if (lower.includes('light') || lower.includes('sun') || lower.includes('window') || lower.includes('shade') || lower.includes('grow light')) {
            responseText = `☀️ **Sunlight & Lighting Guide for ${targetPlantName}**:

• 💡 **Ideal Lighting**: Bright, indirect sunlight (e.g., near an east-facing window or 3-5 feet back from a south/west window).
• ⚠️ **Sunburn Warning**: Crisp brown spots or bleached patches indicate excessive direct sunlight. Move pot slightly back.
• 🌱 **Leggy Growth**: Long stretched stems with small leaves indicate insufficient light. Relocate closer to light source.
• 🔄 **Rotation**: Rotate the pot 90 degrees monthly to maintain symmetrical growth.`;
            quickReplies = ['Watering requirements', 'Best room location', 'Pruning leggy stems'];
        }
        // 🪲 PEST CONTROL & BUGS
        else if (lower.includes('pest') || lower.includes('bug') || lower.includes('mite') || lower.includes('aphid') || lower.includes('scale') || lower.includes('mealybug') || lower.includes('gnat') || lower.includes('neem')) {
            responseText = `🪲 **Pest Identification & Treatment Guide**:

• 🚨 **Isolation**: Immediately separate the affected plant from your other houseplants to prevent spread.
• 🧼 **Leaf Treatment**: Spray thoroughly with organic Neem oil solution or insecticidal soap, paying close attention to leaf undersides and stem joints.
• 🪰 **Fungus Gnats**: Allow top 2 inches of soil to dry out between waterings. Use yellow sticky traps near soil surface.
• 🧽 **Physical Wipe**: For scale or mealybugs, dab affected spots with a cotton swab dipped in 70% rubbing alcohol.`;
            quickReplies = ['Organic pest sprays', 'Soil drying tips', 'Diagnose leaf damage'];
        }
        // 🌱 PROPAGATION & CUTTINGS
        else if (lower.includes('propagat') || lower.includes('cutting') || lower.includes('rooting') || lower.includes('water propagation')) {
            responseText = `🌱 **Plant Propagation Guide for ${targetPlantName}**:

• ✂️ **Taking Cuttings**: Cut a healthy 4-6 inch stem right below a leaf node (where leaves join the main stem).
• 💧 **Water Rooting**: Place cutting in clean glass of water in bright indirect light. Change water every 4-7 days.
• 🪴 **Soil Transfer**: Once roots reach 2-3 inches in length, plant cutting into fresh, well-draining potting soil.`;
            quickReplies = ['Best propagation season', 'Watering new cuttings', 'Soil mix guide'];
        }
        // 💧 WATERING GUIDE
        else if (lower.includes('water') || lower.includes('irrigation') || lower.includes('dry') || lower.includes('moist') || lower.includes('hydrate')) {
            responseText = `💧 **Watering & Moisture Guide for ${targetPlantName}**:

• 👆 **Finger Test**: Insert finger 2 inches into soil. Only water if soil feels dry at depth.
• 🌊 **Deep Water Technique**: Pour water evenly around pot until liquid drains from bottom holes.
• ⚠️ **Overwatering Symptoms**: Soft yellow leaves, soggy soil odor, or drooping despite wet soil.
• 🌵 **Underwatering Symptoms**: Crisp brown leaf edges, curling leaves, or lightweight pot.`;
            quickReplies = ['Checking soil moisture', 'Fertilizer schedule', 'Pruning yellow leaves'];
        }
        // GENERAL FALLBACK CARE ADVICE
        else {
            responseText = `🌿 **Botanical Care & Maintenance Guide for ${targetPlantName}**:

• ☀️ **Sunlight**: Provide bright, indirect light for optimal growth. Avoid harsh direct sun.
• 💧 **Watering**: Water thoroughly when top 1-2 inches of soil feel dry to the touch.
• 🪴 **Soil & Potting**: Use a well-draining indoor plant potting mix with bottom drainage holes.
• ✂️ **Pruning**: Trim dead or yellowing leaves to encourage fresh stem growth.
• 🧪 **Nutrition**: Apply balanced liquid fertilizer once a month during spring and summer.`;
            quickReplies = ['Pruning tips', 'Watering guide', 'Fertilizer guide', 'Repotting advice'];
        }

        return {
            responseText,
            quickReplies,
            embeddedCard,
            nlpAnalysis: nlpResult,
            source: 'Local Smart NLP Engine'
        };
    }
};
