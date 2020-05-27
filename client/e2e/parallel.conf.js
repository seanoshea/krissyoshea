const config = require('./protractor.conf').config;

config.seleniumAddress = 'http://hub-cloud.browserstack.com/wd/hub';
config.commonCapabilities = {
  'browserstack.user': 'seanoshea4',
  'browserstack.key': 'd75JMR6aXSRUDXsEqWsX',
  'name': 'Bstack-[Protractor] Parallel Test'
};
config.directConnect = false;
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
config.multiCapabilities.forEach(function(caps){
  for(var i in config.commonCapabilities) caps[i] = caps[i] || config.commonCapabilities[i];
});

exports.config = config;