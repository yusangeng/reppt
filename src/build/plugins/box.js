export default class Box {
  get name () {
    return 'box'
  }

  autoEnd (token) {
    try {
      const jsonArgs = JSON.parse(token.args)
      const autoEnd = typeof jsonArgs.autoEnd === 'undefined' ? false : jsonArgs.autoEnd

      return autoEnd
    } catch (err) {
      throw new Error(`解析box装饰器的参数失败, args不是合法的json字符串. error: '${err.message}', args: '${token.args}'.`)
    }
  }

  token (context, token, index, tokens) {
    const prefix = context.prefix || (context.prefix = [])
    const line = `import Box from './component/Box'`

    if (prefix.indexOf(line) < 0) {
      prefix.push(line)
    }

    const autoEnd = this.autoEnd(token)

    if (!autoEnd) {
      return tokens
    }

    if (index === tokens.length - 1) {
      return tokens
    }

    const boxEnd = {
      type: 'plugin',
      name: 'boxEnd',
      handled: false
    }

    let endPos = -1
    for (let i = index + 1; i < tokens.length; i++) {
      if (tokens[i].type !== 'space') {
        endPos = i + 1
        break
      }
    }

    tokens.splice(endPos, 0, boxEnd)

    return tokens
  }

  render (context, token) {
    console.log(token)
    return `<Box data={${token.args || ''}}>`
  }
}
