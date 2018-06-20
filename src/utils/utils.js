import { exec } from 'child_process'

export function error (err) {
  let stack = err.stack || ''
  stack = stack.split('\n').filter(el => el.match(/ *at /)).join('\n')
  stack = stack.length ? ('\n\n[REPPT ERROR] stack:\n' + stack) : ''

  console.error(`[REPPT ERROR] ${err.message || err}.${stack}`)
}

export function log (text) {
  console.log(`[REPPT] ${text}.`)
}

export async function run (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}
