import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface InputZoneProps {
    onPromptSubmit: (prompt: string) => void;
}

function InputZone({ onPromptSubmit }: InputZoneProps) {
    const { t, i18n } = useTranslation();
    const [prompt, setPrompt] = useState('');

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onPromptSubmit(prompt);
            setPrompt('');
        }
    };

    return (
        <div className="h-blockSmall w-blockWide rounded-[30px] bg-blockRed border-[17px] border-blockRedDark p-[10px] text-white leading-6" lang={i18n.language}>
            <div className="mb-2">{t("processPrompt")}</div>
            <div className="flex items-center">
                <span className="mr-2">&gt;</span>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent outline-none resize-none"
                    rows={1}
                    placeholder={t("enterPrompt")}
                />
            </div>
        </div>
    );
}

export default InputZone;