import React from "react";
import { MdOutlineSettings } from "react-icons/md";

interface ControlZoneProps {
  onGoClick: () => void;
  onSettingsClick: () => void;
}

function ControlZone({ onGoClick, onSettingsClick }: ControlZoneProps) {
  return (
    <div className="h-blockSmall w-blockSmall flex flex-col gap-[10px]">
      <button
        className="h-buttonSmall w-buttonSmall bg-blockBlue rounded-[37px] flex flex-wrap justify-center items-center"
        onClick={onGoClick}
      >
        <div className="text-[50px] text-blcokBlueDark" lang='en'>GO</div>
      </button> 
      <button
        className="h-buttonSmall w-buttonSmall bg-blockBlue rounded-[37px] flex flex-wrap justify-center items-center"
        onClick={onSettingsClick}
      >
        <MdOutlineSettings size={48} fill='currentColor' className='text-blcokBlueDark' />
      </button>
    </div>
  );
}

export default ControlZone;