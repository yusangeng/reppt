import utils from '../utils'

const { run, log } = utils

export default async function transpileProjectPlugins () {
  return run('npm run plugin-es5').then(stdout => {
    log(stdout)
    return Promise.resolve()
  }).catch(stderr => {
    return Promise.reject(new Error(stderr.message || stderr))
  })
}
