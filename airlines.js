const webdriver = require('selenium-webdriver');
const yaml = require('js-yaml');
const fs = require('fs');
const Cacheman = require('cacheman');
const cache = new Cacheman({
  ttl: 18000,
  engine: 'file'
});

const apicfg = yaml.safeLoad(fs.readFileSync('pushover.yaml', 'utf8'));

const Pushover = require('pushover-notifications');
const pushclient = new Pushover({
  user: apicfg.userkey,
  token: apicfg.apptoken
});

const until = webdriver.until;
const By = webdriver.By;

function sendPush(flight, url, dates) {
  const msg = {
    message: flight.dest, // required
    title: `Flight available for ${flight.orig} to ${flight.dest} on ${dates}`,
    url
  };

  pushclient.send(msg, (err) => {
    if (err) {
      throw err;
    }
  });
}

exports.united = function united(flight) {
  return new Promise((resolve) => {
    const driver = new webdriver.Builder()
      .usingServer('http://localhost:4444/wd/hub')
      .withCapabilities(webdriver.Capabilities.firefox()).
      build();


    const url = `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd?f=${flight.orig}&t=${flight.dest}&d=${flight.date}&tt=1&st=bestmatches&at=1&rm=1&act=1&cbm=-1&cbm2=-1&fa=1&fm2=${flight.date}&co=1&sc=1&px=2&taxng=1&idx=1`;

    const bizCabin = 'a.cabin-option-two';
    driver.get(url);

    console.log(url);

    const dates = [];
    // cabin-option-two
    driver.wait(until.elementLocated(By.css(bizCabin)), 10000, 'Could no bizCabin found')
      .then(() => {
        driver.findElements(By.css(bizCabin)).then((elements) => {
          elements.forEach((element) => {
            element.getAttribute('data-date').then((text) => {
              console.log(text);
              dates.push(text);
            });
          });
        });
      });

    driver.quit().then(() => {
      if (dates.length > 0) {
        const dateString = dates.join(', ');
        const cachekey = `${flight.date}${flight.dest}${flight.orig}`;
        cache.get(cachekey)
          .then((value) => {
            if (dateString !== value) {
              sendPush(flight, url, dates);
              cache.set(cachekey, dateString);
            }
            resolve();
          });
      }
    });
  });
};

