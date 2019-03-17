'use strict'

const debug = {
  log: require('debug')('tag-shadow:log'),
  debug: require('debug')('tag-shadow:debug')
};

module.exports = {
  name: 'shadow',
  type: 'request',
  handler: function(taggedTargets, config, allTargets, targetRequest){
    debug.debug('processing shadow %O', config)
    let voteSize = 1000
    if (config && config.voteSize) {
      voteSize = config.voteSize
    }
    if (!targetRequest.requestDetails.headers
      || targetRequest.requestDetails.headers['x-shadow-request']) {
      debug.debug('non shadow request %O', targetRequest)
      for (let i in taggedTargets) {
        if(config && config.disable) {
          taggedTargets[i].online = false
          continue
        }
        // For non shadow request, all shadow tags are voting down.
        taggedTargets[i].vote -= voteSize
      }
      return
    }
    for (let i in taggedTargets) {
      // For shadow request, all shadow tags are voting up.
      taggedTargets[i].vote += voteSize
    }
  }
}
