if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs = require('fs');
var utils = require('utils');
var f = utils.format;
var casper = require('casper').create({
    faultTolerant: false
});

// Overriding Casper.open to prefix all test urls
casper.setFilter('open.location', function(location) {
    return 'file://' + phantom.casperPath + '/' + location;
});

var tests = [];

if (casper.cli.args.length) {
    tests = casper.cli.args.filter(function(path) {
        return fs.isFile(path) || fs.isDirectory(path);
    });
} else {
    casper.echo('No test path passed, exiting.', 'RED_BAR', 80);
    casper.exit(1);
}

casper.test.runSuites.apply(casper.test, tests);
