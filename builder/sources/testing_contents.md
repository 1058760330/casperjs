<span class="label label-info">Hint</span>
If you intend to write large test suites, check out the [`casperjs test` command](#casper-test-command).

CasperJS ships with a handful set of tools to be used as a functional
testing framework. For example, let's test write a tests suite for
testing google search (yes, you read it well):

```javascript
var casper = require('casper').create();

casper.start('http://www.google.fr/', function() {
    this.test.assertTitle('Google', 'google homepage title is the one expected');
    this.test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
        q: 'foo'
    }, true);
});

casper.then(function() {
    this.test.assertTitle('foo - Recherche Google', 'google title is ok');
    this.test.assertUrlMatch(/q=foo/, 'search term has been submitted');
    this.test.assertEval(function() {
        return __utils__.findAll('h3.r').length >= 10;
    }, 'google search for "foo" retrieves 10 or more results');
});

casper.run(function() {
    this.test.done(5); // checks that 5 assertions have been executed
    this.test.renderResults(true);
});
```

As you can see, the `test` propery of the `casper` object is a reference to
a [`tester.Tester`](api.html#tester) object, which is used to execute the
assertions and renders the results.

<span class="label label-info">Note</span>
You can find the whole `tester.Tester` API documentation in the [dedicated section](api.html#tester).

Now run the tests suite:

```
$ casperjs samples/googletesting.js
```

You'll probably get something like this:

![capture](images/testsuiteok.png)

In case any assertion fails, you'd rather get something like the
following:

![capture](images/testsuitefail.png)

* * * * *

### Exporting results in *xUnit* format

CasperJS can export the results of the test suite to an xUnit XML file,
which is compatible with continuous integration tools such as
[Jenkins](http://jenkins-ci.org/). To save the xUnit log of your test
suite to a `log.xml` file, you can process this way:

```javascript
casper.run(function() {
    this.test.renderResults(true, 0, 'log.xml');
});
```

A cooler way is to add an option to your script using CLI argument
parsing:

```javascript
casper.run(function() {
    this.test.renderResults(true, 0, this.cli.get('save') || false);
});
```

Then you can run:

```
$ casperjs test.js --save=log.xml
```

* * * * *

<h1 id="casper-test-command">The <code>casperjs test</code> command</h1>

Writing all your tests in a single file may be painful, to say the least. That's where the
`casperjs test` command comes to the rescue, as it allows to split your tests across different
files among other handy little things.

Let's take this first test file as an example:

```javascript
// file: /path/to/test/dir/test1.js

casper.test.comment('My first test file');
casper.test.assert(true, "true is so true");
casper.test.assertNot(false, "false is wrong");
casper.test.done(2); // I must be called, and I'll check that
                     // two assertions have been executed
```

And this second one:

```javascript
// file: /path/to/test/dir/test2.js

casper.test.comment('This is my second test file, a bit more async');

casper.start('http://my.location.tld/', function() {
    this.test.assertNot(false, "false is so false");
});

casper.run(function() {
    this.test.done(1); // I must be called once all the async stuff
                       // has been executed. I'll also check that a
                       // single assertions has been performed.
});
```

<span class="label label-success">Note</span> The `expected` parameter of `Tester.done()` has been added in 1.0.

Now let's run our test suite using `casperjs test`:

```
$ casperjs test /path/to/test/dir/
```

This is theoretically what you will get:

![image](images/split-test-results.png)

Also, you can of course run a single test file as well:

```javascript
$ casperjs test /path/to/test/dir/test1.js
```

<div class="alert-message block-message">
  <p>
    <span class="label label-important">Important</span>
    There are <strong>two important conditions</strong> for splitting
    your test suite across several files:
  </p>
  <ol class="bottom">
    <li>
      <p>
        <strong>Not</strong> to create a new <code>Casper</code> instance
        in a split test file;
      </p>
    </li>
    <li>
      <p>
        To call the <code>Tester.done()</code> method when all the tests
        contained in a single file have been executed.
      </p>
    </li>
  </ol>
</div>

* * * * *

### Options

Some options are available using the `casperjs test` command:

- `--xunit=<filename>` will export test suite results in a xUnit XML file
- `--direct` will output log messages directly to the console
- `--log-level=<logLevel>` sets the logging level (see the
  [related section](logging.html))
- <span class="label label-success">Added in 1.0</span>
  `--includes=foo.js,bar.js` will includes the `foo.js` and `bar.js` files
  before each test file execution
- <span class="label label-success">Added in 1.0</span>
  `--pre=pre-test.js` will add the tests contained in `pre-test.js`
  __before__ executing the test suite
- <span class="label label-success">Added in 1.0</span>
  `--post=post-test.js` will add the tests contained in `post-test.js`
  __after__ having executed the whole test suite
- <span class="label label-success">Added in 1.0</span>
  `--fail-fast` will terminate the current test suite as soon as a first failure is encountered.

Sample custom command:

```
$ casperjs test --includes=foo.js,bar.js \
                --pre=pre-test.js \
                --post=post-test.js \
                --direct \
                --log-level=debug \
                --fail-fast \
                test1.js test2.js /path/to/some/test/dir
```

<span class="label label-success">Hint</span>
A [demo gist](https://gist.github.com/3813361) is also available in order
to get you started with a sample suite involving some of these options.

* * * * *

### CasperJS own test suite

<span class="label label-success">Added in 1.0</span>
CasperJS has its own unit and functional test suite, located in the
`tests` subfolder. To run this test suite:

```
$ cd /path/to/casperjs
$ casperjs selftest
```

<span class="label label-info">Note</span>
Running this test suite is a great way to find any bug on your platform. If it fails, feel free to
[file an issue](https://github.com/n1k0/casperjs/issues/new) or to ask on the
[CasperJS mailing-list](https://groups.google.com/forum/#!forum/casperjs).

* * * * *

### Extending Casper for Testing

The `$ casperjs test [path]` command is just a shortcut for
`$ casper /path/to/casperjs/tests/run.js [path]`; so if you want to
extend Casper capabilities for your tests, your best bet is to write
your own runner and extend the casper object instance from there.

<span class="label label-info">Hint</span> You can find the default runner code in
[`./tests/run.js`](https://github.com/n1k0/casperjs/blob/master/tests/run.js).
