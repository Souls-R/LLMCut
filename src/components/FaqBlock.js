import { useTranslation } from "react-i18next";

function FaqBlock({ className, tKey }) {

    const { t, i18n } = useTranslation();

    const lang = i18n.language;
    let textLarge = '32px';
    let textSmall = '20px';
    let leading = 'leading-[1.5]';

    if (lang === 'en') {
        textLarge = '40px';
        textSmall = '24px';
        leading = 'leading-[1.1]';
    }

    return (
        <div className={`flex flex-col justify-between w-blockLarge h-blockLarge rounded-[75px] p-[36px] ${leading} ${className}`} lang={lang}>
            <p className={`text-[${textLarge}]`}>{t(`${tKey}.title`)}</p>
            <p className={`text-[${textSmall}]`}>{t(`${tKey}.text`)}</p>
        </div>
    )
}

export default FaqBlock;