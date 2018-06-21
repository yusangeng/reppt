import fs from 'fs'
import isFunction from 'lodash/isFunction'
import Markdown from 'pluggable-markdown'
import { format } from 'prettier'
import myPlugins from './plugins'
import processMarkedOutput from './processMarkedOutput'

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
  const raw = processMarkedOutput(md.output)
  const { prefix } = md.context

  const jsx = format(`
    import React from 'react'
    import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
    // import { TransitionGroup, CSSTransition } from 'react-transition-group'

    ${prefix.join('\n')}

    export default class PPT extends React.Component {
      static get displayName () {
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

