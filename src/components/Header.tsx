import React from "react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineTranslate } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function Header() {
    const { i18n } = useTranslation();

    const changeLanguage = () => {
        const lng = i18n.language === 'en' ? 'zh-CN' : 'en';
        i18n.changeLanguage(lng);
    };

    return (
        <header className="flex justify-between items-center w-full p-8">
            <a href="https://github.com/Souls-R/LLMCut" target="_black"><FaGithub size={36} fill='currentColor' /></a>
            <button onClick={() => changeLanguage()} className="flex items-center">
                <MdOutlineTranslate size={36} fill='currentColor' />
                {/* <MaterialSymbol icon="translate" size={36} /> */}
            </button>
        </header>
    );
}

export default Header;