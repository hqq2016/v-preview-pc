module.exports = {
  chainWebpack(config){
    const eslintRule = config.module.rule('eslint')
    eslintRule.uses.clear()
  }
}