import './App.css';
import UploadZone from './UploadZone.js';
import InputZone from './InputZone.js';
import ControlZone from './ControlZone.js';
import { useTranslation } from 'react-i18next';
import Header from './Header.js';
import FaqBlock from './FaqBlock.js';

function App() {

  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col w-full h-auto min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-end h-[180px]">
        <div className="text-[150px] leading-[1]" lang='en'>
          LLMCut
        </div>
        <div className="text-[30px] leading-[1]" lang={i18n.language}>
          {t("banner")}
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-[30px] py-[20px] text-[24px]">
        <UploadZone />
        <InputZone />
        <ControlZone />
      </div>
      <div className='flex flex-wrap gap-[36px] mx-[calc(50%-338px)] py-[30px]'>
        <div className="w-blockLarge h-blockLarge flex flex-wrap justify-center items-center text-[180px]" lang='en'>FAQ</div>
        <FaqBlock className='bg-blockYellow text-blockYellowDark' tKey='faq_1' />
        <FaqBlock className='bg-blockRed text-white' tKey='faq_2' />
        <FaqBlock className='bg-blockBlue text-blockBlueDark' tKey='faq_3' />
      </div>
      <div className='flex flex-wrap gap-[25px] items-center justify-center h-[120px] text-[30px]' lang='en'>
        <div>GitHub</div>
        <div>Souls-R</div>
      </div>
    </div>
  );

}

export default App;