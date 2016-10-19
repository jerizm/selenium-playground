var webdriver = require('selenium-webdriver'),
  yaml = require('js-yaml'),
  fs   = require('fs'),
  argv = require('minimist')(process.argv.slice(2));

var apicfg = yaml.safeLoad(fs.readFileSync('pushover.yaml', 'utf8'));

var push = require('pushover-notifications');
var p = new push( {
  user: apicfg.userkey,
  token: apicfg.apptoken
});

var until = webdriver.until;
var by = webdriver.By;

function sendPush(flight, url) {
  var msg = {
    message: flight.dest, // required
    title:  `Flight available for ${flight.orig} to ${flight.dest}`,
    url: url
  };

  p.send( msg, function( err, result ) {
    if ( err ) {
      throw err;
    }
  });
}

exports.united = function united(flight, driver) {
  var url = `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd?f=${flight.orig}&t=${flight.dest}&d=${flight.date}&tt=1&st=bestmatches&at=1&rm=1&act=1&cbm=-1&cbm2=-1&fa=1&fm2=${flight.date}&co=1&sc=1&px=2&taxng=1&idx=1`

  driver.get(url);

  // cabin-option-two
  driver.wait(until.elementLocated(by.css('a.cabin-option-two')), 10000, 'Could not locate the child element within the time specified')
    .then(() => {
      sendPush(flight, url);
    });

  driver.quit();
}

