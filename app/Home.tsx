'use client'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FaGithub } from "react-icons/fa"
import { LLM, getCommandArray } from './utils/llm'

export default function Home() {
  const logDivRef = useRef(null)
  const ffmpegRef = useRef(new FFmpeg())
  const [ffmpegLog, setffmpegLog] = useState<string[]>([])
  const [files, setFiles] = useState([])
  const [prompt, setPrompt] = useState('')
  const [llmConfig, setllmConfig] = useState({
    endpoint: '',
    key: '',
    model: ''
  })
  const llm = new LLM(llmConfig.endpoint, llmConfig.key, llmConfig.model)

  const printLog = (message: string) => {
    setffmpegLog((prev) => [...prev, message])
  }

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files))
  }

  useEffect(() => {
    if (logDivRef.current) {
      logDivRef.current.scrollTop = logDivRef.current.scrollHeight
    }
  }, [ffmpegLog])

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

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
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
      toast.info('ffmpeg加载中...' )
      printLog('ffmpeg加载中...')
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      toast.success('ffmpeg加载完成，版本 ffmpeg core v0.12.6', { toastId: 'ffmpeg' })
      printLog('ffmpeg加载完成，版本 ffmpeg core v0.12.6')
    }
    loadffmpeg()
  }, [])

  const ffmpegRun = async () => {
    let cmdArray = []
    if (prompt.startsWith('!') || prompt.startsWith('！')) {
      cmdArray = getCommandArray(prompt.slice(1))
    }
    else {
      try {
        cmdArray = await llm.requestModel(files.map(file => file.name).join(','), prompt)
        console.log(files.map(file => file.name).join(','), prompt)
        printLog(cmdArray.join(' '))
        toast.info('开始处理: ' + cmdArray.join(' '))
      } catch (error) {
        console.error(error)
        toast.error('请求模型失败，请检查配置')
        return
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
      toast.success('处理完成')

      for (let file of output) {
        toast.info('文件' + file.name + '已生成')
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
      toast.error('处理失败')
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto my-12 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">ffmpeg.zh_CN</h1>
          <div className=' flex flex-row justify-center'>
            <p className="text-gray-500 dark:text-gray-400">使用自然语言与 ffmpeg wasm 在浏览器中编辑视频。</p>
            <a href="https://github.com/Souls-R/ffmpeg.zh_CN" target="_blank" rel="noopener noreferrer">
              <FaGithub className="mx-2 my-1 text-base hover:cursor-pointer" />
            </a>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4 space-y-6">
            <div className="collapse collapse-arrow">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                # LLM配置
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
                  type="text"
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
              </div>
            </div>

            <div className="px-3.5 space-y-4">
              <div
                className=" text-xl font-medium"
              >
                # 文件区域
              </div>
              <input
                className="file-input w-full file-input-bordered"
                multiple={true}
                type="file"
                onChange={handleFileChange}
              />
              {files.map((file, index) => (
                <div key={index} className="badge badge-outline mx-0.5">
                  {file.name}
                </div>
              ))}
              <div>
                <div
                  className=" text-xl font-medium mb-2"
                >
                  # 想要怎样处理呢？
                </div>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm  min-h-[100px]"
                  id="ffmpeg-settings"
                  placeholder={"将输入的视频的第三秒到第五秒转换为gif格式，分辨率为720p，码率为1Mbps，减少帧率为10fps。\n\n或者以!开头，直接使用ffmpeg命令。"}
                  onChange={(event) => setPrompt(event.target.value)}
                  value={prompt}
                >
                </textarea>
              </div>
              <button
                className="btn btn-outline w-full"
                onClick={ffmpegRun}
              >
                开始处理
              </button>
              <div
                ref={logDivRef}
                className="flex flex-col w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[100px] max-h-[30vh] overflow-y-auto whitespace-pre-line"
              >
                {ffmpegLog.map((log, index) => (
                  <div key={index} style={{ whiteSpace: 'pre-line' }}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

