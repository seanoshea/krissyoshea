// const config = require('./protractor.conf').config;
config = {}
config.browserstackUser = process.env.BROWSERSTACK_USERNAME
config.browserstackKey = process.env.BROWSERSTACK_ACCESS_KEY

config.specs = [
  './src/**/*.e2e-spec.ts'
]

config.commonCapabilities = {
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'build': 'protractor-browserstack',
  'name': 'parallel_test',
  'browserstack.debug': 'true',
  'browserstack.local': 'true'
};
config.directConnect = false;
config.multiCapabilities = [{
  'browserName': 'Chrome'
}, {
  'browserName': 'Safari'
}, {
  'browserName': 'Firefox'
}, {
  'browserName': 'IE'
}];

// Code to support common capabilities
config.multiCapabilities.forEach(function (caps) {
  for (var i in config.commonCapabilities) caps[i] = caps[i] || config.commonCapabilities[i];
});

exports.config = config;