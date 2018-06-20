import fs from 'fs'
import prompt from 'prompt'
import initFiles from './initFiles'
import initNodeModules from './initNodeModules'
import utils from '../utils'

const { log } = utils

export default async function init () {
  const rootPath = process.cwd()
  const stat = fs.statSync(rootPath)

  if (!stat.isDirectory()) {
    throw new Error(`非法目录: ${rootPath}.`)
  }

  const data = await askPrompt()

  log('正在初始化目录和文件...')
  await initFiles(rootPath, data)

  log('正在安装依赖包...')
  await initNodeModules()
}

async function askPrompt () {
  return new Promise((resolve, reject) => {
    prompt.start({
      message: 'REPPT'
    })
    prompt.get(['name', 'author', 'email'], (err, answer) => {
      if (err) {
        reject(err)
        return
      }

      resolve(answer)
    })
  }).then(answer => {
    return Promise.resolve(answer)
  }).catch(err => {
    return Promise.reject(new Error(`输入参数有误: ${err.message}.`))
  })
}
