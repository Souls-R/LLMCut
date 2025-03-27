import React, { useRef, useState } from "react";
import { MdOutlineFileCopy } from "react-icons/md";
import { useTranslation } from 'react-i18next';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
}

function UploadZone({ onFileSelect }: UploadZoneProps) {
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect(file); // 调用回调函数
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className="h-blockSmall w-blockSmall rounded-[30px] bg-blockYellow border-[17px] border-blockYellow flex flex-col justify-center items-center pt-[15px]"
            onClick={handleClick}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
            />
            <MdOutlineFileCopy size={84} fill='currentColor' className='text-blockYellowDark' />
            <div className="text-blockYellowDark text-[30px]" lang={i18n.language}>{t("upload")}</div>
            {selectedFile && (
                <div className="text-blockYellowDark text-[20px] mt-[10px]" lang={i18n.language}>
                    {selectedFile.name}
                </div>
            )}
        </div>
    );
}

export default UploadZone;