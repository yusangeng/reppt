import fs from 'fs'
import isFunction from 'lodash/isFunction'
import Markdown from 'pluggable-markdown'
import myPlugins from './plugins'
import utils from '../utils'
import { format } from 'prettier'

const { log } = utils

export default async function genPPTJs (dstFilename, srcFilename, projectPluginsFilename) {
  const srcStat = fs.statSync(srcFilename)

  if (!srcStat.isFile()) {
    throw new Error(`文件不存在: ${srcFilename}.`)
  }

  const md = new Markdown()
  const projectPluginsStat = fs.statSync(projectPluginsFilename)

  if (projectPluginsStat.isFile()) {
    const projectPlugins = require(projectPluginsFilename)

    if (Array.isArray(projectPlugins)) {
      projectPlugins.forEach(Plugin => {
        const pl = isFunction(Plugin) ? new Plugin() : Plugin
        md.registerPlugin(pl)
      })
    }
  }

  if (Array.isArray(myPlugins)) {
    myPlugins.forEach(Plugin => {
      const pl = isFunction(Plugin) ? new Plugin() : Plugin
      md.registerPlugin(pl)
    })
  }

  const mdContent = fs.readFileSync(srcFilename, { encoding: 'utf8' })

  md.exec(mdContent)

  writePPTFile(md, dstFilename)
}

function writePPTFile (md, dstFilename) {
  const raw = processOutput(md.output)
  const { prefix } = md.context

  const jsx = format(`
    import React from 'react'
    import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
    // import { TransitionGroup, CSSTransition } from 'react-transition-group'

    ${prefix.join('\n')}

    export default class PPT extends React.Component {
      static displayName () {
        return 'PPT'
      }

      componentDidMount () {
        this.onKeyDown_ = this.onKeyDown.bind(this)
        document.addEventListener('keydown', this.onKeyDown_)
      }

      componentWillUnmount () {
        document.removeEventListener('keydown', this.onKeyDown_)
        this.onKeyDown_ = null
      }

      onKeyDown (evt) {
        const code = evt.code.toLowerCase()

        if (code === 'space' || code === 'arrowright' || code === 'arrowdown') {
          this.goNext()
        } else if (code === 'arrowleft' || code === 'arrowup') {
          this.goPrev()
        }
      }

      goNext () {
        const currIndex = parseInt(window.location.pathname.replace(/^\\//, ''))

        if (currIndex >= ${md.context.pageCount} - 1) {
          return
        }

        this.router_.history.push('/' + (currIndex + 1))
      }

      goPrev () {
        const currIndex = parseInt(window.location.pathname.replace(/^\\//, ''))

        if (currIndex === 0) {
          return
        }

        this.router_.history.push('/' + (currIndex - 1))
      }

      render () {
        return <div className="ppt">
          <Router ref={c => { this.router_ = c }}>
            <div className="pages">
              ${raw}
              <Route exact path='/' render={_ => <Redirect to={'/0'} />} />
            </div>
          </Router>
        </div>
      }
    }
  `, {
    semi: false,
    parser: 'babylon',
    tabWidth: 2,
    useTabs: false,
    singleQuote: true,
    bracketSpacing: true,
    jsxBracketSameLine: true,
    arrowParens: 'avoid'
  })

  fs.writeFileSync(dstFilename, jsx, { encoding: 'utf8' })
}

const transFns = [transCode, transClassname]

function processOutput (src) {
  log('正在将markdown编译结果转化为合法jsx...')
  return transFns.reduce((prev, fn) => fn(prev), src)
}

function transCode (src) {
  return src.replace(/<code(.*?)>((.|\n)+?)<\/code>/g, (match, p1, p2) => {
    return `<code ${p1}>{\`${p2}\`}</code>`
  })
}

function transClassname (src) {
  return src.replace('class=', 'className=')
}

