var webdriver = require('selenium-webdriver'),
yaml = require('js-yaml'),
fs   = require('fs'),
argv = require('minimist')(process.argv.slice(2));

var until = webdriver.until;
var by = webdriver.By;

var config = yaml.safeLoad(fs.readFileSync('flights.yaml', 'utf8'));

var flight = config.flights[argv.i];
console.log(flight);
var driver = new webdriver.Builder()
   .usingServer('http://localhost:4444/wd/hub')
   .withCapabilities(webdriver.Capabilities.firefox()).
   build();


var url = `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd?f=${flight.orig}&t=${flight.dest}&d=${flight.date}&tt=1&st=bestmatches&at=1&rm=1&act=1&cbm=-1&cbm2=-1&fa=1&fm2=${flight.date}&co=1&sc=1&px=2&taxng=1&idx=1`
driver.get(url);

// cabin-option-two
driver.wait(until.elementLocated(by.css('a.cabin-option-two')), 10000, 'Could not locate the child element within the time specified');

(function(name){
  driver.takeScreenshot().then(function(data) {
    writeScreenshot(data, name + '.png');
  });
})(flight.dest);

driver.quit();

function writeScreenshot(data, name) {
  name = name || 'ss.png';
  var screenshotPath = '/home/jerry/Dropbox/flights/';
  fs.writeFileSync(screenshotPath + name, data, 'base64');
}
