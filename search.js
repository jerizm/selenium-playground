const yaml = require('js-yaml');
const fs = require('fs');

const co = require('co');

const airlines = require('./airlines');
const config = yaml.safeLoad(fs.readFileSync('flights.yaml', 'utf8'));

co.wrap(function * flights() {
  for (const flight of config.flights) {
    yield airlines[flight.airline](flight);
  }
})();

