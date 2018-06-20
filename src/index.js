import init from './init'
import build from './build'
import play from './play'
// import utils from './utils'

// const { error } = utils

export default async function reppt (command, ...args) {
  try {
    if (command === 'init') {
      await init(...args)
    } else if (command === 'build') {
      await build(...args)
    } else if (command === 'play') {
      await play(...args)
    } else {
      throw new Error(`Unknown command: ${command}.`)
    }
  } catch (err) {
    // error(err.message)
    throw err
  }
}
