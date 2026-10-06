import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PLANT_BOTANIST_SYSTEM_INSTRUCTION = `You are PlantAI Botanist, an expert AI assistant specialized exclusively in plants, gardening, plant care, plant diseases, soil, watering, sunlight, fertilization, propagation, pruning, repotting, pests, plant identification, and related botanical topics.

You must remain strictly within the plant domain.

For plant-related questions:
- Give accurate, concise, and practical answers.
- Use clean structured sections with headings (###), bold text, and bullet points.
- Provide actionable plant-care recommendations.
- Mention uncertainty when information is insufficient.
- Ask follow-up questions when plant species, environment, or symptoms are unclear.

For non-plant questions:
Politely respond:
"I'm PlantAI Botanist, specialized exclusively in plant-related questions. Please ask me something about plants, gardening, plant care, diseases, or identification!"`;

// Helper to call Gemini REST API securely
async function callGeminiRestApi(message, plantContext, apiKey, attachment) {
    if (!apiKey) return null;

    const CANDIDATE_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
    const parts = [];

    let promptText = message;
    if (plantContext) {
        promptText = `[Context: Saved Plant "${plantContext.nickname || plantContext.speciesName}" (${plantContext.speciesName}), Location: ${plantContext.location || 'Indoor'}, Last Watered: ${plantContext.lastWatered || 'N/A'}]\n\nUser Question: ${message}`;
    }

    parts.push({ text: promptText });

    if (attachment && typeof attachment === 'string' && attachment.includes('base64,')) {
        const mimeType = attachment.substring(attachment.indexOf(':') + 1, attachment.indexOf(';'));
        const base64Data = attachment.substring(attachment.indexOf('base64,') + 7);
        parts.push({
            inlineData: { mimeType: mimeType || 'image/jpeg', data: base64Data }
        });
    }

    const payload = {
        contents: [{ role: 'user', parts }],
        systemInstruction: {
            parts: [{ text: PLANT_BOTANIST_SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 900
        }
    };

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
                if (candidateText) {
                    return {
                        success: true,
                        message: candidateText,
                        source: `Gemini ${model.includes('2.0') ? '2.0' : '1.5'} Flash ⚡`
                    };
                }
            }

            const errJson = await res.json().catch(() => ({}));
            lastError = errJson?.error?.message || `HTTP ${res.status}`;
        } catch (err) {
            lastError = err.message;
        }
    }

    return {
        success: false,
        error: lastError || 'Failed to contact Gemini API endpoints'
    };
}

// POST /api/chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, plantContext, conversationId, attachment, apiKey: clientApiKey } = req.body;
        const apiKey = process.env.GEMINI_API_KEY || clientApiKey || process.env.VITE_GEMINI_API_KEY;

        if (!message && !attachment) {
            return res.status(400).json({ success: false, error: 'Message or attachment is required.' });
        }

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                error: 'No Gemini API key configured. Provide key in server environment or Settings.'
            });
        }

        const result = await callGeminiRestApi(message, plantContext, apiKey, attachment);

        if (result && result.success) {
            return res.json({
                success: true,
                message: result.message,
                conversationId: conversationId || `conv-${Date.now()}`,
                plant: plantContext ? plantContext.speciesName : null,
                source: result.source,
                suggestions: ['Watering guide', 'Pruning tips', 'Fertilizer advice', 'Diagnose leaf spots']
            });
        }

        return res.status(500).json({
            success: false,
            error: result?.error || 'Gemini API call failed'
        });
    } catch (err) {
        console.error('API Chat Endpoint Error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'PlantAI API Server', time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🌿 PlantAI Express API Server running at http://localhost:${PORT}`);
});
