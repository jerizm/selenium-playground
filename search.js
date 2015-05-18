var webdriver = require('selenium-webdriver');
yaml = require('js-yaml');
fs   = require('fs'),
argv = require('minimist')(process.argv.slice(2));

var config = yaml.safeLoad(fs.readFileSync('flights.yaml', 'utf8'));

var flight = config.flights[argv.i];
console.log(flight);
var driver = new webdriver.Builder()
   .usingServer('http://redis:4444/wd/hub')
   .withCapabilities(webdriver.Capabilities.firefox()).
   build();

driver.get('http://www.united.com/web/en-US/default.aspx?root=1');

driver.findElement(webdriver.By.id('ctl00_ContentInfo_Booking1_rdoSearchType2')).click();
driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$Origin$txtOrigin')).sendKeys(flight.orig);
driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$Destination$txtDestination')).sendKeys(flight.dest);
driver.findElement(webdriver.By.id('ctl00_ContentInfo_Booking1_SearchBy_rdosearchby3')).click();
driver.findElement(webdriver.By.id('ctl00_ContentInfo_Booking1_DepDateTime_Depdate_txtDptDate')).click();
driver.findElement(webdriver.By.id('ctl00_ContentInfo_Booking1_DepDateTime_Depdate_txtDptDate')).sendKeys(flight.date);
driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$btnSearchFlight')).click();
(function(name){
  driver.takeScreenshot().then(function(data) {
    writeScreenshot(data, name + '.png');
  });
})(flight.dest);
driver.quit();

function writeScreenshot(data, name) {
  name = name || 'ss.png';
  var screenshotPath = '/Users/jwang/Dropbox/flights/';
  fs.writeFileSync(screenshotPath + name, data, 'base64');
}
