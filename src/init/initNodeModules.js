import utils from '../utils'

const { run, log } = utils

export default async function initNodeModules () {
  return run('npm i').then(stdout => {
    log(stdout)
    return Promise.resolve()
  }).catch(stderr => {
    return Promise.reject(new Error(stderr.message || stderr))
  })
}
