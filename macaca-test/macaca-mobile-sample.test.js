'use strict';

var path = require('path');
var _ = require('macaca-utils');

var platform = process.env.platform || 'iOS';
platform = platform.toLowerCase();

var iOSOpts = {
  platformVersion: '9.3',
  deviceName: 'iPhone 5s',
  platformName: 'iOS',
  //bundleId: 'xudafeng.ios-app-bootstrap',
  app: path.join(__dirname, '..', 'app', `${platform}-app-bootstrap.zip`)
};

var androidOpts = {
  platformName: 'Android',
  //package: 'com.github.android_app_bootstrap',
  //activity: 'com.github.android_app_bootstrap.activity.WelcomeActivity',
  app: path.join(__dirname, '..', 'app', `${platform}-app-bootstrap.zip`)
};

var wd = require('webdriver-client')(_.merge({}, platform === 'ios' ? iOSOpts : androidOpts));

describe('macaca mobile sample', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.initPromiseChain();

  driver.configureHttp({
    timeout: 600000
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
      .login('中文+Test+12345678', '111111')
      .sleep(1000);
  });

  it('#2 should display home', function() {
    return driver
      .takeScreenshot();
  });

  it('#3 should scroll tableview', function() {
    return driver
      .elementByName('HOME')
      .click()
      .elementByName('list')
      .click()
      .swipe(200, 400, 200, 100, 500)
      .sleep(1000);
  });

  it('#4 should display webview', function() {
    return driver
      .elementByName('Webview')
      .click()
      .sleep(3000)
      .takeScreenshot();
  });

  it('#5 should go into webview', function() {
    return driver
      .webview()
      .elementById('pushView')
      .tap()
      .sleep(5000)
      .webview()
      .elementById('popView')
      .tap()
      .sleep(5000)
      .takeScreenshot();
  });

  it('#6 should go into test', function() {
    return driver
      .native()
      .elementByName('Baidu')
      .click()
      .sleep(5000)
      .takeScreenshot();
  });

  it('#7 should works with web', function() {
    return driver
      .webview()
      .elementById('index-kw')
      .sendKeys('中文+TesterHome')
      .elementById('index-bn')
      .tap()
      .sleep(5000)
      .source()
      .then(function(html) {
        html.should.containEql('TesterHome');
      })
      .takeScreenshot();
  });

  it('#8 should logout success', function() {
    return driver
      .native()
      .elementByName('PERSONAL')
      .click()
      .sleep(1000)
      .takeScreenshot()
      .elementByName('Logout')
      .click()
      .sleep(1000)
      .takeScreenshot();
  });
});
