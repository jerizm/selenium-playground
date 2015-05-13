var webdriver = require('selenium-webdriver');
yaml = require('js-yaml');
fs   = require('fs');

var config = yaml.safeLoad(fs.readFileSync('flights.yaml', 'utf8'));
console.log(config.flights);
for(var i = 0; i < config.flights.length; i++) {
  var flight = config.flights[i];
  var driver = new webdriver.Builder().
     withCapabilities(webdriver.Capabilities.chrome()).
     build();

  driver.get('http://www.united.com/web/en-US/default.aspx?root=1');

  driver.findElement(webdriver.By.id('ctl00_ContentInfo_Booking1_rdoSearchType2')).click();
  driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$Origin$txtOrigin')).sendKeys(flight.orig);
  driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$Destination$txtDestination')).sendKeys(flight.dest);
  driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$DepDateTime$Depdate$txtDptDate')).sendKeys(flight.date);
  driver.findElement(webdriver.By.id('ctl00_ContentInfo_Booking1_SearchBy_rdosearchby3')).click();
  driver.findElement(webdriver.By.name('ctl00$ContentInfo$Booking1$btnSearchFlight')).click();

}
