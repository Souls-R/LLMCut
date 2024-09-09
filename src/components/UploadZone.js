import { MaterialSymbol } from 'react-material-symbols';
import { useTranslation } from 'react-i18next';

function UploadZone() {

    const { t, i18n } = useTranslation();
    return (
    <div className="h-blockSmall w-blockSmall rounded-[30px] bg-blockYellow border-[17px] border-blockYellow flex flex-col justify-center items-center pt-[15px]">
        <MaterialSymbol icon="file_copy" size={84} fill grade={-25} className='text-blockYellowDark' />
        <div className="text-blockYellowDark text-[30px]" lang={i18n.language}>{t("upload")}</div>
    </div>
    )
}

export default UploadZone;