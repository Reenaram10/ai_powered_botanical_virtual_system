/**
 * Gemini API Service - Proxy calls to backend /api/chat endpoint
 */
export async function sendBackendChatApi({ message, plantContext, conversationId, attachment, apiKey }) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                plantContext,
                conversationId: conversationId || `conv-${Date.now()}`,
                attachment,
                apiKey
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }

        const errData = await response.json().catch(() => ({}));
        return {
            success: false,
            error: errData?.error || `Server HTTP Status ${response.status}`
        };
    } catch (err) {
        console.warn('Backend /api/chat unavailable, using direct fallback:', err);
        return {
            success: false,
            error: err.message || 'Backend network unreachable'
        };
    }
}
