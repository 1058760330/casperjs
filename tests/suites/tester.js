var fs = require('fs');

var t = casper.test;

t.comment('Tester.testEquals()');
t.assert(t.testEquals(null, null), 'Tester.testEquals() null equality');
t.assertNot(t.testEquals(null, undefined), 'Tester.testEquals() null vs. undefined inequality');
t.assert(t.testEquals("hi", "hi"), 'Tester.testEquals() string equality');
t.assertNot(t.testEquals("hi", "ih"), 'Tester.testEquals() string inequality');
t.assert(t.testEquals(5, 5), 'Tester.testEquals() number equality');
t.assertNot(t.testEquals("5", 5), 'Tester.testEquals() number equality without implicit cast');
t.assert(t.testEquals(5, 5.0), 'Tester.testEquals() number equality with cast');
t.assertNot(t.testEquals(5, 10), 'Tester.testEquals() number inequality');
t.assert(t.testEquals([], []), 'Tester.testEquals() empty array equality');
t.assert(t.testEquals([1,2], [1,2]), 'Tester.testEquals() array equality');
t.assert(t.testEquals([1,2,[1,2,function(){}]], [1,2,[1,2,function(){}]]), 'Tester.testEquals() complex array equality');
t.assertNot(t.testEquals([1,2,[1,2,function(a){}]], [1,2,[1,2,function(b){}]]), 'Tester.testEquals() complex array inequality');
t.assertNot(t.testEquals([1,2], [2,1]), 'Tester.testEquals() shuffled array inequality');
t.assertNot(t.testEquals([1,2], [1,2,3]), 'Tester.testEquals() array length inequality');
t.assert(t.testEquals({}, {}), 'Tester.testEquals() empty object equality');
t.assert(t.testEquals({a:1,b:2}, {a:1,b:2}), 'Tester.testEquals() object length equality');
t.assert(t.testEquals({a:1,b:2}, {b:2,a:1}), 'Tester.testEquals() shuffled object keys equality');
t.assertNot(t.testEquals({a:1,b:2}, {a:1,b:3}), 'Tester.testEquals() object inequality');
t.assert(t.testEquals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:26}}), 'Tester.testEquals() complex object equality');
t.assertNot(t.testEquals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:27}}), 'Tester.testEquals() complex object inequality');
t.assert(t.testEquals(function(x){return x;}, function(x){return x;}), 'Tester.testEquals() function equality');
t.assertNot(t.testEquals(function(x){return x;}, function(y){return y+2;}), 'Tester.testEquals() function inequality');

t.comment('Tester.sortFiles()');
var files = t.findTestFiles(fs.pathJoin(phantom.casperPath, 'tests', 'testdir'));
t.assertEquals(files, [
    "/Users/niko/Sites/casperjs/tests/testdir/01_a/abc.js",
    "/Users/niko/Sites/casperjs/tests/testdir/01_a/def.js",
    "/Users/niko/Sites/casperjs/tests/testdir/02_b/ABC.js",
    "/Users/niko/Sites/casperjs/tests/testdir/02_b/abc.js",
    "/Users/niko/Sites/casperjs/tests/testdir/03_a.js",
    "/Users/niko/Sites/casperjs/tests/testdir/03_b.js",
    "/Users/niko/Sites/casperjs/tests/testdir/04/01_init.js",
    "/Users/niko/Sites/casperjs/tests/testdir/04/02_do.js"
], 'findTestFiles() find test files and sort them');

t.done();
