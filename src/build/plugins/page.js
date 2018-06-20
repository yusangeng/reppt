export default class Page {
  get name () {
    return 'page'
  }

  token (context, token, index, tokens) {
    const prefix = context.prefix || (context.prefix = [])

    // 当前page序号, 用于route
    context.pageCount = context.pageCount || 0
    token.pageIndex = context.pageCount
    context.pageCount += 1

    const line = `import Page from './component/Page'`

    if (prefix.indexOf(line) < 0) {
      prefix.push(line)
    }

    const len = tokens.length
    let insertTokenIndex = -1
    let i = 0

    for (i = index + 1; i < len; i++) {
      const currToken = tokens[i]
      const prevToken = tokens[i - 1]

      if (currToken.type === 'plugin' &&
        currToken.name === 'page') {
        if (prevToken.type !== 'plugin' || prevToken.name !== 'pageEnd') {
          insertTokenIndex = i
        }

        break
      }
    }

    const pageEnd = {
      type: 'plugin',
      name: 'pageEnd',
      handled: false
    }

    if (i === len && tokens[len - 1].name !== 'pageEnd') {
      tokens.push(pageEnd)
      // console.log(tokens)
      return tokens
    }

    if (insertTokenIndex > 0) {
      tokens.splice(insertTokenIndex, 0, pageEnd)
    }

    // console.log(tokens)
    return tokens
  }

  render (context, token) {
    return `<Page pageIndex={${token.pageIndex}}>`
  }
}
