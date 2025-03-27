import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import UploadZone from './UploadZone';
import InputZone from './InputZone';
import ControlZone from './ControlZone';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import FaqBlock from './FaqBlock';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { getCommandArray, LLM } from '../utils/llm';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { css } from '../MZPXflat.ttf?subsets';
console.log(css)

function App() {
  const { t, i18n } = useTranslation();
  const ffmpegRef = useRef(new FFmpeg())
  const [ffmpegLog, setffmpegLog] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [llmConfig, setllmConfig] = useState({
    endpoint: '',
    key: '',
    model: ''
  })
  const llm = useRef(new LLM(llmConfig.endpoint, llmConfig.key, llmConfig.model))
  const [currentPrompt, setCurrentPrompt] = useState('')
  const handleFileSelect = (file: File) => {
    //如果文件已存在则替换
    if (files.map(file => file.name).indexOf(file.name) !== -1) {
      setFiles(files.map(f => f.name === file.name ? file : f))
    } else {
      setFiles([...files, file])
    }
  }
  const printLog = (message: string) => {
    setffmpegLog((prev) => [...prev, message])
  }

  useEffect(() => {
    if (localStorage.getItem('llmConfig')) {
      setllmConfig(JSON.parse(localStorage.getItem('llmConfig')))
    }
    else {
      setllmConfig({
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        key: '',
        model: 'llama3-8b-8192'
      })
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (message.startsWith("frame=")) {
        printLog(message + "_frame")
        return
      } else if (message.startsWith("[adts @") || message.startsWith("[mp4 @")) {
        printLog(message + "_time")
        return
      } else if (message.endsWith("error reading header")) {
        printLog("errorReadingHeader")
        return
      }
      printLog(message)
    })

    const loadffmpeg = async () => {
      // toBlobURL is used to bypass CORS issue
      printLog('ffmpeg加载中...')
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    })
      printLog('ffmpeg加载完成，版本 ffmpeg core v0.12.6')
    }
    loadffmpeg()
  }, [])


  const handlePromptSubmit = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  const ffmpegRun = async () => {
    if (files.length === 0) {
      printLog('请先上传文件');
      return;
    }
    if (!currentPrompt) {
      printLog('请输入处理要求');
      return;
    }
    setIsProcessing(true);
    let cmdArray = [];
    if (currentPrompt.startsWith('!') || currentPrompt.startsWith('！')) {
      cmdArray = getCommandArray(currentPrompt.slice(1));
    } else {
      try {
        cmdArray = await llm.current.requestModel(files.map(file => file.name).join(','), currentPrompt);
        if (!cmdArray) {
          printLog('生成命令失败，请重试');
          setIsProcessing(false);
          return;
        }
        printLog('生成命令: ' + cmdArray.join(' '));
        printLog('开始处理...');
      } catch (error) {
        console.error(error);
        printLog('请求模型失败，请检查配置');
        setIsProcessing(false);
        return;
      }
    }
    //删除cmdArray中的ffmpeg
    cmdArray.shift()
    console.log('cmdArray--------------', cmdArray)
    try {
      const ffmpeg = ffmpegRef.current
      for (let file of files) {
        await ffmpeg.writeFile(file.name, await fetchFile(file))
      }
      let dirList = await ffmpeg.listDir("./")
      console.log('dirList', dirList)
      await ffmpeg.exec(cmdArray)
      let output = await ffmpeg.listDir("./")
      output = output.filter(file => dirList.map(dir => dir.name).indexOf(file.name) === -1)
      console.log('output', output)
      printLog('处理完成')

      for (let file of output) {
        console.log('文件' + file.name + '已生成')
        let data = await ffmpeg.readFile(file.name)
        const url = URL.createObjectURL(new Blob([data]))
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
      }
    } catch (error) {
      console.error(error)
    }
  }

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
        <UploadZone onFileSelect={handleFileSelect} />
        <InputZone onPromptSubmit={handlePromptSubmit} />
        <ControlZone 
          onGoClick={ffmpegRun} 
          onSettingsClick={() => document.getElementById('settings-modal')?.classList.toggle('hidden')}
        />
      </div>
      {/* 日志显示区域 */}
      {ffmpegLog.length > 0 && (
        <div className="mx-auto w-[80%] max-w-[800px] mt-4 p-4 bg-gray-100 rounded-lg">
          <div className="text-sm font-mono whitespace-pre-wrap">
            {ffmpegLog.map((log, index) => (
              <div key={index} className="py-1">{log}</div>
            ))}
          </div>
        </div>
      )}
      {/* 设置弹窗 */}
      <div id="settings-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px]">
          <h2 className="text-2xl mb-4">API设置</h2>
          <input
            className="w-full p-2 mb-3 border rounded"
            type="text"
            value={llmConfig.endpoint}
            placeholder="API端点地址"
            onChange={(e) => {
              const newConfig = { ...llmConfig, endpoint: e.target.value };
              setllmConfig(newConfig);
              localStorage.setItem('llmConfig', JSON.stringify(newConfig));
              llm.current = new LLM(newConfig.endpoint, newConfig.key, newConfig.model);
            }}
          />
          <input
            className="w-full p-2 mb-3 border rounded"
            type="password"
            placeholder="API密钥"
            value={llmConfig.key}
            onChange={(e) => {
              const newConfig = { ...llmConfig, key: e.target.value };
              setllmConfig(newConfig);
              localStorage.setItem('llmConfig', JSON.stringify(newConfig));
              llm.current = new LLM(newConfig.endpoint, newConfig.key, newConfig.model);
            }}
          />
          <input
            className="w-full p-2 mb-3 border rounded"
            type="text"
            placeholder="模型名称"
            value={llmConfig.model}
            onChange={(e) => {
              const newConfig = { ...llmConfig, model: e.target.value };
              setllmConfig(newConfig);
              localStorage.setItem('llmConfig', JSON.stringify(newConfig));
              llm.current = new LLM(newConfig.endpoint, newConfig.key, newConfig.model);
            }}
          />
          <button
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => document.getElementById('settings-modal')?.classList.add('hidden')}
          >
            关闭
          </button>
        </div>
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

            
              <div className="collapse-content">
                <input
                  className="input input-bordered w-full my-1"
                  type="text"
                  value={llmConfig.endpoint}
                  placeholder='api端点地址'
                  onChange={(event) => {
                    setllmConfig({ ...llmConfig, endpoint: event.target.value })
                    localStorage.setItem('llmConfig', JSON.stringify({ ...llmConfig, endpoint: event.target.value }))
                  }}
                />
                <input
                  className="input input-bordered w-full my-1"
                  type="password"
                  placeholder='api密钥'
                  value={llmConfig.key}
                  onChange={(event) => {
                    setllmConfig({ ...llmConfig, key: event.target.value })
                    localStorage.setItem('llmConfig', JSON.stringify({ ...llmConfig, key: event.target.value }))
                  }}
                />
                <input
                  className="input input-bordered w-full my-1"
                  type="text"
                  placeholder='模型'
                  value={llmConfig.model}
                  onChange={(event) => {
                    setllmConfig({ ...llmConfig, model: event.target.value })
                    localStorage.setItem('llmConfig', JSON.stringify({ ...llmConfig, model: event.target.value }))
                  }}
                />
                <div
                className="flex flex-col w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[100px] max-h-[30vh] overflow-y-auto whitespace-pre-line"
              >
                {ffmpegLog.map((log, index) => (
                  <div key={index} style={{ whiteSpace: 'pre-line' }}>{log}</div>
                ))}
              </div>
              </div>
    </div>
  );

}

export default App;