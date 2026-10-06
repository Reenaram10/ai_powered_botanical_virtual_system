import React from 'react';

const QUICK_ACTIONS = [
    { label: '💧 Watering Guide', prompt: 'Give me detailed watering instructions for this plant.' },
    { label: '✂️ Pruning Tips', prompt: 'What are the best pruning tips and maintenance steps?' },
    { label: '🧪 Fertilizer Guide', prompt: 'What fertilizer schedule and NPK ratio should I use?' },
    { label: '🪴 Repotting Advice', prompt: 'How and when should I repot this plant with proper soil mix?' },
    { label: '☀️ Light Requirements', prompt: 'What are the sunlight and window light requirements?' },
    { label: '🐛 Pest Treatment', prompt: 'How do I detect and treat common plant pests organic spray?' },
    { label: '🩺 Disease Diagnosis', prompt: 'How do I diagnose leaf yellowing and fungal spots?' }
];

export const QuickActions = ({ onSelectAction }) => {
    return (
        <div className="flex flex-wrap gap-1.5 pt-2">
            {QUICK_ACTIONS.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelectAction(action.prompt)}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-700/60 shadow-xs transition-all active:scale-95"
                >
                    {action.label}
                </button>
            ))}
        </div>
    );
};
