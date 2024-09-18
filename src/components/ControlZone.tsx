import React from "react";
import { MdOutlineSettings } from "react-icons/md";

function ControlZone() {
  return (
    <div className="h-blockSmall w-blockSmall flex flex-col gap-[10px]">
      <button className="h-buttonSmall w-buttonSmall bg-blockBlue rounded-[37px] flex flex-wrap justify-center items-center">
        <div className="text-[50px] text-blcokBlueDark" lang='en'>GO</div>
      </button>
      <button className="h-buttonSmall w-buttonSmall bg-blockBlue rounded-[37px] flex flex-wrap justify-center items-center">
        <MdOutlineSettings size={48} fill='currentColor' className='text-blcokBlueDark' />
        {/* <MaterialSymbol icon="settings" size={48} fill grade={-25} className='text-blcokBlueDark' /> */}
      </button>
    </div>
  )
}

export default ControlZone;