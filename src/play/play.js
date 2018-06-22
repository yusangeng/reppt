import fs from 'fs'
import path from 'path'
import readConfig from '../build/readConfig'
import transpileProjectPlugins from '../build/transpileProjectPlugins'
import genPPTJs from '../build/genPPTJs'
import utils from '../utils'

const { run, log } = utils

async function genPPT (rootPath) {
  log('正在读取配置...')
  const configFilename = path.join(rootPath, 'reppt.config.json')
  const config = readConfig(configFilename)

  log('正在转译插件脚本...')
  await transpileProjectPlugins(config)

  const markdownFilename = path.join(rootPath, 'src/ppt.md')
  const pptFilename = path.join(rootPath, 'src/ppt.js')
  const projectPluginsFilename = path.join(rootPath, 'plugins5/index.js')

  log('正在生成PPT脚本...')
  await genPPTJs(config, pptFilename, markdownFilename, projectPluginsFilename)
}

export default async function play () {
  const rootPath = process.cwd()
  const stat = fs.statSync(rootPath)

  if (!stat.isDirectory()) {
    throw new Error(`非法目录: ${rootPath}.`)
  }

  await genPPT(rootPath)

  log('启动PPT播放, 请访问 http://127.0.0.1:9000')

  fs.watch(path.resolve(rootPath, './src/ppt.md'), async _ => {
    await genPPT(rootPath)
  })

  return run('npm run webpack-play').then(stdout => {
    log(stdout)
    return Promise.resolve()
  }).catch(stderr => {
    return Promise.reject(new Error(stderr.message || stderr))
  })
}
