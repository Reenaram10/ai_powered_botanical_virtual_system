import React from 'react';

/**
 * Parses markdown formatted text (headings, bold, bullet lists, numbered lists, line breaks)
 * into structured, accessible React JSX elements. Fixes raw markdown like **Sunlight** in UI.
 */
export const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    // Helper to format inline markdown (bold text, inline code, links)
    const formatInline = (text) => {
        if (!text) return '';

        // Split by bold pattern **text**
        const parts = text.split(/(\*\*[^*]+\*\*)/g);

        return parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const innerText = part.slice(2, -2);
                return (
                    <strong key={idx} className="font-bold text-emerald-950 dark:text-emerald-100">
                        {innerText}
                    </strong>
                );
            }
            return part;
        });
    };

    // Split input into lines
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null; // 'bullet' or 'number'

    const flushList = () => {
        if (currentList.length > 0) {
            if (listType === 'bullet') {
                elements.push(
                    <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-2">
                        {currentList.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 shrink-0" />
                                <span className="flex-1 leading-relaxed">{formatInline(item)}</span>
                            </li>
                        ))}
                    </ul>
                );
            } else if (listType === 'number') {
                elements.push(
                    <ol key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-2 list-decimal list-inside">
                        {currentList.map((item, i) => (
                            <li key={i} className="text-xs sm:text-sm leading-relaxed">
                                <span>{formatInline(item)}</span>
                            </li>
                        ))}
                    </ol>
                );
            }
            currentList = [];
            listType = null;
        }
    };

    lines.forEach((line, lineIdx) => {
        const trimmed = line.trim();

        // Check for Headings
        if (trimmed.startsWith('### ')) {
            flushList();
            elements.push(
                <h3 key={`h3-${lineIdx}`} className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-50 mt-3 mb-1.5 flex items-center gap-1.5">
                    {formatInline(trimmed.replace('### ', ''))}
                </h3>
            );
        } else if (trimmed.startsWith('## ')) {
            flushList();
            elements.push(
                <h2 key={`h2-${lineIdx}`} className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-emerald-100 mt-4 mb-2">
                    {formatInline(trimmed.replace('## ', ''))}
                </h2>
            );
        } else if (trimmed.startsWith('# ')) {
            flushList();
            elements.push(
                <h1 key={`h1-${lineIdx}`} className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-50 mt-4 mb-2">
                    {formatInline(trimmed.replace('# ', ''))}
                </h1>
            );
        }
        // Check for Bullet items (•, -, *)
        else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listText = trimmed.replace(/^([•\-*])\s+/, '');
            if (listType && listType !== 'bullet') flushList();
            listType = 'bullet';
            currentList.push(listText);
        }
        // Check for Numbered items (1., 2., etc.)
        else if (/^\d+\.\s+/.test(trimmed)) {
            const listText = trimmed.replace(/^\d+\.\s+/, '');
            if (listType && listType !== 'number') flushList();
            listType = 'number';
            currentList.push(listText);
        }
        // Paragraph / Blank line
        else if (trimmed === '') {
            flushList();
            elements.push(<div key={`space-${lineIdx}`} className="h-2" />);
        }
        // Regular Text Line
        else {
            flushList();
            elements.push(
                <p key={`p-${lineIdx}`} className="my-1 text-xs sm:text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
                    {formatInline(trimmed)}
                </p>
            );
        }
    });

    flushList();

    return <div className="markdown-body space-y-1">{elements}</div>;
};
