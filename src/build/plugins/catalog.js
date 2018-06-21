export default class Catalog {
  get name () {
    return 'catalog'
  }

  token (context, token, index, tokens) {
    const prefix = context.prefix || (context.prefix = [])

    const line = `import Catalog from './component/Catalog'`

    if (prefix.indexOf(line) < 0) {
      prefix.push(line)
    }

    const pageTokens = tokens.map((el, elIndex) => {
      return {
        tokenIndex: elIndex,
        token: el
      }
    }).filter(el => el.token.type === 'plugin' && el.token.name === 'page')

    const titles = pageTokens.map((el, pageIndex) => {
      const { tokenIndex } = el
      let nextToPageToken = tokens[tokenIndex + 1]
      const unknown = pageIndex ? '未命名' : '首页'

      if (!nextToPageToken) {
        return unknown
      }

      if (nextToPageToken.type === 'space') {
        nextToPageToken = tokens[tokenIndex + 2]

        if (!nextToPageToken) {
          return unknown
        }
      }

      if (nextToPageToken.type === 'plugin') {
        return unknown
      }

      if (nextToPageToken.type !== 'heading') {
        return unknown
      }

      return nextToPageToken.text
    })

    token.items = titles

    return tokens
  }

  render (context, token) {
    const { items } = token
    const itemsProps = items.map(el => `'${el}'`).join(',')
    return `<Catalog items={[${itemsProps}]} />`
  }
}
