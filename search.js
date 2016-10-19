var webdriver = require('selenium-webdriver'),
  yaml = require('js-yaml'),
  fs   = require('fs'),
  argv = require('minimist')(process.argv.slice(2));

var airlines = require('./airlines');
var config = yaml.safeLoad(fs.readFileSync('flights.yaml', 'utf8'));
var flight = config.flights[argv.i];
console.log(flight);
var driver = new webdriver.Builder()
  .usingServer('http://localhost:4444/wd/hub')
  .withCapabilities(webdriver.Capabilities.firefox()).
  build();

airlines[flight.airline](flight, driver);
