import path from 'path'
import fs from 'fs'
import walk from 'fs-walk'
import mkdir from 'mkdirp'
import ejs from 'ejs'
import Confirm from 'prompt-confirm'
import utils from '../utils'

const { log } = utils

class FileInit {
  constructor (data = {}) {
    this.data = data
  }

  async exec (dir) {
    const templateDir = path.resolve(__dirname, '../../assets/template')
    const promises = []

    walk.walkSync(templateDir, async (basedir, filename, stat) => {
      const absName = path.join(basedir, filename)

      if (stat.isDirectory()) {
        this.initDir(templateDir, dir, absName)
        return
      }

      if (stat.isFile()) {
        promises.push(this.initFile(templateDir, dir, absName))
      }
    })

    return Promise.all(promises)
  }

  initDir (srcDir, dstDir, dirName) {
    const newDirName = dirName.replace(new RegExp(`^${srcDir}`), dstDir)
    mkdir.sync(newDirName)
  }

  async initFile (srcDir, dstDir, srcFilename) {
    const dstFilename = srcFilename.replace(new RegExp(`^${srcDir}`), dstDir).replace(/\.ejs$/, '')

    if (srcFilename.endsWith('.ejs')) {
      await this.initEjsFile(dstFilename, srcFilename)
      return
    }

    await this.initNormalFile(dstFilename, srcFilename)
  }

  async initEjsFile (dst, src) {
    log(`正在构建文件: ${src} -> ${dst}.`)

    const srcContent = fs.readFileSync(src, { encoding: 'utf8' })
    const tmpl = ejs.compile(srcContent)
    const dstContent = tmpl(this.data)

    await this.writeFile(dstContent, dst)
  }

  async initNormalFile (dst, src) {
    const srcContent = fs.readFileSync(src, { encoding: 'utf8' })
    await this.writeFile(srcContent, dst)
  }

  async writeFile (content, filename) {
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, content, { encoding: 'utf8' })
      return
    }

    const stat = fs.statSync(filename)

    if (stat.isDirectory()) {
      throw new Error(`filename指向一个目录: ${filename}.`)
    }

    if (stat.isFile()) {
      const prompt = new Confirm({
        message: '文件已存在, 是否覆盖?'
      })

      const answer = await prompt.run()

      if (answer) {
        fs.writeFileSync(filename, content, { encoding: 'utf8' })
      }
    }
  }
}

export default async function initFiles (dir, data = {}) {
  const fi = new FileInit(data)
  await fi.exec(dir)
}
