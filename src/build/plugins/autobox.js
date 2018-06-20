import Box from './box'

export default class AutoBox extends Box {
  get name () {
    return 'autobox'
  }

  autoEnd (tokens) {
    return true
  }
}
