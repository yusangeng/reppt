let imageCount = 0

export default class Image {
  get name () {
    return 'image'
  }

  token (context, token, index, tokens) {
    const prefix = context.prefix || (context.prefix = [])
    const symbol = `image${imageCount++}`
    const line = `import ${symbol} from '${token.args}'`

    if (prefix.indexOf(line) < 0) {
      prefix.push(line)
    }

    token.symbol = symbol

    return tokens
  }

  render (context, token) {
    return `<div class="plugin-image"><img src={${token.symbol}} /></div>`
  }
}
