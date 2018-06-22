import utils from '../utils'

const { run, log } = utils

export default async function buildProject (config, rootPath) {
  return run('npm run webpack-build').then(stdout => {
    log(stdout)
    return Promise.resolve()
  }).catch(stderr => {
    return Promise.reject(new Error(stderr.message || stderr))
  })
}
