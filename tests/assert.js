var testResults = {
    passed: 0,
    failed: 0
};

phantom.Casper.extend({
    assert: function(condition, message) {
        var status = '[PASS]';
        if (condition === true) {
            testResults.passed++;
        } else {
            status = '[FAIL]';
            testResults.failed++;
        }
        this.echo([status, message].join(' '));
    },

    assertEquals: function(testValue, expected, message) {
        if (expected === testValue) {
            this.echo('[PASS] ' + message);
            testResults.passed++;
        } else {
            this.echo('[FAIL] ' + message);
            this.echo('       got:      ' + testValue);
            this.echo('       expected: ' + expected);
            testResults.failed++;
        }
    },

    assertEval: function(fn, message) {
        return this.assert(this.evaluate(fn), message);
    },

    assertEvalEquals: function(fn, expected, message) {
        return this.assertEquals(this.evaluate(fn), expected, message);
    },

    assertMatch: function(subject, pattern, message) {
        return this.assert(pattern.test(subject), message);
    },

    assertTitle: function(expected, message) {
        return this.assertEvalEquals(function() {
            return document.title;
        }, expected, message);
    },

    assertUrlMatch: function(pattern, message) {
        return this.assertMatch(this.getCurrentUrl(), pattern, message);
    },

    renderResults: function() {
        this.echo("==========================================");
        var total = testResults.passed + testResults.failed,
            status = testResults.failed > 0 ? 'FAIL' : 'OK';
        this.echo(status + ': ' + total + ' tests executed, ' + testResults.passed + ' passed, ' + testResults.failed + ' failed.');
        this.exit();
    }
});