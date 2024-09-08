import './App.css';
import { MaterialSymbol } from 'react-material-symbols';

function App() {
  return (
    <div className="flex flex-col w-full h-auto min-h-screen">
      <div className="flex flex-col items-center justify-end h-[230px]">
        <div className="text-[150px] leading-[1]">
          LLMCut
        </div>
        <div className="text-[30px] leading-[1]">
          Use Nature Language to process your video
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-[30px] py-[20px] text-[24px]">
        <div className="h-[165px] w-[165px] rounded-[30px] bg-[#FFDF6F] border-[17px] border-[#FFDF6F] flex flex-col justify-center items-center pt-[15px]">
        <MaterialSymbol icon="file_copy" size={84} fill grade={-25} color='#967500' />
        <div className="text-[#967500] text-[30px]">UPLOAD</div>
        </div>
        <div className="h-[165px] w-[414px] rounded-[30px] bg-[#FF6F6F] border-[17px] border-[#FF4040] p-[10px] text-white leading-5">
          HOW DO YOU WANT TO PROCESS YOUR VIDEO? &gt;
        </div>
        <div className="h-[165px] w-[165px] flex flex-col gap-[10px]">
          <div className="h-[77px] w-[77px] bg-[#6DCBFF] rounded-[37px] flex flex-wrap justify-center items-center">
            <div className="text-[50px] text-[#005584]">GO</div>
          </div>
          <div className="h-[77px] w-[77px] bg-[#6DCBFF] rounded-[37px] flex flex-wrap justify-center items-center">
          <MaterialSymbol icon="settings" size={48} fill grade={-25} color='#005584' />
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-[36px] mx-[calc(50%-338px)] py-[30px]'>
        <div className="w-[320px] h-[320px] flex flex-wrap justify-center items-center text-[180px]">FAQ</div>
        <div className="w-[320px] h-[320px] rounded-[75px] p-[48px] bg-[#FFDF6F] text-[30px]">Element 2</div>
        <div className="w-[320px] h-[320px] rounded-[75px] p-[48px] bg-[#FF6F6F] text-[30px]">Element 3</div>
        <div className="w-[320px] h-[320px] rounded-[75px] p-[48px] bg-[#6DCBFF] text-[30px]">Element 4</div>
      </div>
      <div className='flex flex-wrap gap-[25px] items-center justify-center h-[120px] text-[30px]'>
        <div>GitHub</div>
        <div>Souls-R</div>
      </div>
    </div>
  );
}

export default App;