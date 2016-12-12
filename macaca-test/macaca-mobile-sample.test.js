'use strict';

var path = require('path');
var _ = require('macaca-utils');
var xml2map = require('xml2map');

var platform = process.env.platform || 'Android';
platform = platform.toLowerCase();

var iOSOpts = {
  deviceName: 'iPhone 5s',
  platformName: 'iOS',
  //udid: '',
  //bundleId: 'xudafeng.ios-app-bootstrap',
  app: path.join(__dirname, '..', 'app', `${platform}-app-bootstrap.zip`)
};

var androidOpts = {
  platformName: 'Android',
  //udid: '',
  //package: 'com.github.android_app_bootstrap',
  //activity: 'com.github.android_app_bootstrap.activity.WelcomeActivity',
  app: path.join(__dirname, '..', 'app', `${platform}-app-bootstrap.zip`)
};

var wd = require('webdriver-client')(_.merge({}, platform === 'ios' ? iOSOpts : androidOpts));

// override back for ios
wd.addPromiseChainMethod('customback', function() {
  if (platform === 'ios') {
    return this;
  }

  return this
    .back();
});

describe('macaca mobile sample', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.initPromiseChain();

  driver.configureHttp({
    timeout: 600 * 1000
  });

  before(function() {
    return driver
      .initDriver();
  });

  after(function() {
    return driver
      .sleep(1000)
      .quit();
  });

  it('#1 should login success', function() {
    return driver
      .getWindowSize()
      .then(size => {
        console.log(`current window size ${JSON.stringify(size)}`);
      })
      .login('中文+Test+12345678', '111111')
      .sleep(1000);
  });

  it('#2 should display home', function() {
    return driver
      .source()
      .then(res => {
        var xml = xml2map.tojson(res);
        console.log(xml);
      })
      .takeScreenshot()
      .saveScreenshot('1.png');
  });
});
