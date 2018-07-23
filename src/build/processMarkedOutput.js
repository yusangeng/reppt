import utils from '../utils'

const { log, recoverEntities } = utils

function transImage (src) {
  return src.replace(/<img(.+?)>/g, (match, p1) => {
    return `<img ${p1.replace(/\/$/, '')} />`
  })
}

function transCode (src) {
  return src.replace(/<code(.*?)>((.|\n)+?)<\/code>/g, (match, p1, p2) => {
    let recoveredCode = recoverEntities(p2)

    recoveredCode = recoveredCode
      .replace('\\', '\\\\')
      .replace("'", "\\'")
      .replace('"', '\\"')
      .split('\n')
      .map(el => `'${el}'`)
      .join('+\n')

    return `<code ${p1}>
      {
        ${recoveredCode}
      }
    </code>`
  })
}

function transClassname (src) {
  return src.replace(/class=/g, 'className=')
}

const transFns = [transImage, transCode, transClassname]

export default function processMarkedOutput (src) {
  log('正在将markdown编译结果转化为合法jsx...')
  return transFns.reduce((prev, fn) => fn(prev), src)
}
