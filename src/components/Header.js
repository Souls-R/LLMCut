import { MaterialSymbol } from 'react-material-symbols';
import { useTranslation } from 'react-i18next';

function Header() {
    const { i18n } = useTranslation();

    const changeLanguage = () => {
        const lng = i18n.language === 'en' ? 'zh-CN' : 'en';
        i18n.changeLanguage(lng);
    };

    return (
        <header className="flex justify-end items-center w-full p-8">
            <button onClick={() => changeLanguage()} className="flex items-center">
                <MaterialSymbol icon="translate" size={36} />
            </button>
        </header>
    );
}

export default Header;