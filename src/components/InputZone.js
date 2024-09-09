import { useTranslation } from 'react-i18next';

function InputZone() {
    const { t, i18n } = useTranslation();
    return (
        <div className="h-blockSmall w-blockWide rounded-[30px] bg-blockRed border-[17px] border-blockRedDark p-[10px] text-white leading-6" lang={i18n.language}>
            {t("processPrompt")}<br></br>&gt;
        </div>
    )
}

export default InputZone;