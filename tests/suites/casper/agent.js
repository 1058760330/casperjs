/*global casper*/
/*jshint strict:false*/
function testUA(ua, match) {
    casper.test.assertMatch(
        ua, match, 'Default user agent matches ' + match
    );
}

function fetchUA(request) {
    testUA(request.headers.filter(function(header) {
        return header.name === "User-Agent";
    }).pop().value, /plop/);
}

casper.test.begin('userAgent() tests', 2, function(test) {
    testUA(casper.options.pageSettings.userAgent, /CasperJS/);
    casper.start();
    casper.userAgent('plop').once('resource.requested', fetchUA);
    casper.thenOpen('tests/site/index.html');
    casper.run(function() {
        test.done();
    });
});
