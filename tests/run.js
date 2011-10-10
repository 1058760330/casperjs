phantom.injectJs('casper.js');
phantom.injectJs('tests/assert.js');

var casper = new phantom.Casper({
    faultTolerant: false,
    verbose: true,
});

phantom.args.forEach(function(arg) {
    var debugMatch = /--loglevel=(\w+)/.exec(arg);
    if (debugMatch) {
        casper.options.logLevel = debugMatch[1];
    }
});

casper.start('tests/site/index.html', function(self) {
    self.assertEvalEquals(function() {
        return document.title;
    }, 'CasperJS test index', 'start() casper can start itself an open an url');
    self.click('a:first-child');
});

casper.assert(casper.steps.length === 1, 'start() can add a new navigation step');

casper.then(function(self) {
    self.assertEvalEquals(function() {
        return document.title;
    }, 'CasperJS test target', 'click() casper can click on a text link and react when it is loaded');
    self.click('a:first-child');
});

casper.assert(casper.steps.length === 2, 'then() adds a new navigation step');

casper.then(function(self) {
    self.fill('form[action="form.html"]', {
        email:   'chuck@norris.com',
        content: 'Am watching thou',
        check:   true,
        choice:  'no',
        file:    phantom.libraryPath + '/README.md'
    });
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="email"]').value;
    }, 'chuck@norris.com', 'fill() can fill an input[type=text] form field');
    self.assertEvalEquals(function() {
        return document.querySelector('textarea[name="content"]').value;
    }, 'Am watching thou', 'fill() can fill a textarea form field');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="check"]').checked;
    }, true, 'fill() can check a form checkbox');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="no"]').checked;
    }, true, 'fill() can check a form radio button');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="no"]').checked;
    }, true, 'fill() can check a form radio button');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="file"]').files.length === 1;
    }, true, 'fill() can select a file to upload');
    self.evaluate(function() {
        document.querySelector('form[action="form.html"]').submit();
    })
});

casper.run(function(self) {
    self.renderResults();
});
