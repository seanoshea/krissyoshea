const config = require('./protractor.conf').config;

config.commonCapabilities = {
  'browserstack.user': 'seanoshea4',
  'browserstack.key': 'd75JMR6aXSRUDXsEqWsX',
  'build': 'protractor-browserstack',
  'name': 'parallel_test',
  'browserstack.debug': 'true',
  'browserName': 'Chrome'
};
config.seleniumAddress = 'http://localhost:4444/wd/hub';
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