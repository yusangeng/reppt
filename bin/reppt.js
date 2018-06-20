#!/usr/bin/env node

var program = require('commander')
var reppt = require('../lib').default
var utils = require('../lib/utils').default

var error = utils.error
var log = utils.log

program
  .version('1.0.0')
  .command('init')
  .action(async function () {
    try {
      await reppt('init')
    } catch (err) {
      error(err)
    }
  })

program
  .command('build')
  .action(async function () {
    try {
      await reppt('build')
    } catch (err) {
      error(err)
      // throw err
    }
  })

program
  .command('play')
  .action(async function () {
    try {
      await reppt('play')
    } catch (err) {
      error(err)
    }
  })

program
  .command('help')
  .action(function () {
    log(' 请访问: https://github.com/yusangeng/reppt .')
  })

program
  .command('*')
  .action(function (cmd) {
    error({ message: '错误的命令: ' + cmd + '.' })
  })

program.parse(process.argv)
