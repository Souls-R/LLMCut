
function getCommandArray(cmd: string) {
    if (cmd.length == 0) { return []; }
    cmd = cmd.replace(/[ ]{2,}/g, " ");
    const cmdArray = [];
    let flag = false;
    let temp = "";
    for (let i = 0; i < cmd.length; i++) {
        if (cmd[i] == '"') {
            flag = !flag;
            continue;
        }
        if (cmd[i] == ' ' && !flag) {
            cmdArray.push(temp);
            temp = "";
            continue;
        }
        temp += cmd[i];
    }
    cmdArray.push(temp);
    return cmdArray;
}


class LLM {
    endpoint: string
    key: string
    model: string

    constructor(endpoint: string, key: string, model: string = 'llama3-8b-8192') {
        this.endpoint = endpoint
        this.key = key
        this.model = model
    }

    async requestModel(files: string, prompt: string) {
        try {
            let messages = [
                {
                    "role": "system",
                    "content": "你是ffmpeg的专家，帮助用户的需求产生ffmpeg命令，只需要输出以ffmpeg开头的命令即可，无需输出其他内容。"
                },
                {
                    "role": "user",
                    "content": `目前已有的文件为:${files}。\n需求:${prompt}`
                },
            ];
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.key}`,
                    'Content-Type': 'application/json'
                }
            };
            const body = {
                model: this.model,
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
            };

            const response = await fetch(this.endpoint, {
                ...options,
                body: JSON.stringify({ messages: messages, ...body })
            });
            const data = await response.json()

            let anwser = data.choices[0].message.content
            console.log('anwser', anwser);
            //正则匹配ffmpeg开头的命令
            let reg = /^ffmpeg.*$/
            let result = anwser.match(reg)
            if (result) return getCommandArray(result[0])

        } catch (error) {
            console.error(error);
            throw new Error('请求模型失败');
        }
    }
}

export  {LLM, getCommandArray};