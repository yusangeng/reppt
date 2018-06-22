import fs from 'fs'

export default function readConfig (filename) {
  try {
    const configSrc = fs.readFileSync(filename, { encoding: 'utf8' })
    return JSON.parse(configSrc)
  } catch (err) {
    return {}
  }
}
