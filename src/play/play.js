import fs from 'fs'
import utils from '../utils'

const { run, log } = utils

export default async function play () {
  const rootPath = process.cwd()
  const stat = fs.statSync(rootPath)

  if (!stat.isDirectory()) {
    throw new Error(`非法目录: ${rootPath}.`)
  }

  log('启动PPT播放, 请访问 http://127.0.0.1:9000')
  return run('npm run webpack-play').then(stdout => {
    log(stdout)
    return Promise.resolve()
  }).catch(stderr => {
    return Promise.reject(new Error(stderr.message || stderr))
  })
}
