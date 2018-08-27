'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HEAD:'"http://test.holdfun.cn:80/energyboss/api"'
})
