const config = require('./protractor.conf').config;

config.seleniumAddress = 'http://hub-cloud.browserstack.com/wd/hub';
config.commonCapabilities = {
  'browserstack.user': 'seanoshea4',
  'browserstack.key': 'd75JMR6aXSRUDXsEqWsX',
  'name': 'Bstack-[Protractor] Parallel Test'
};
config.multiCapabilities = [{
  'browserName': 'Chrome'
},{
  'browserName': 'Safari'
},{
  'browserName': 'Firefox'
},{
  'browserName': 'IE'
}];

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});

exports.config = config;