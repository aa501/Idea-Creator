var test = require('tape');
var now = require('performance-now');
var rifraf = require('../index');

function get7() {
    var i = 0;
    var l = 7;
    var set = [];
    for (; i < l; i++) {
        set.push({index: i});
    }
    return set;
}

if (rifraf.isNative) {
    test('#request defers approximately 16ms by default', function (t) {
        t.plan(7);
        var set = get7();
        var i = 0;
        var start;
        function tick(dt) {
            var prev = set[i-1];
            var item = set[i++];
            item.time = performance.now();
            if (prev && i > 2) t.ok((item.time - start) >= 0, 'time has passed: ' + (item.time - prev.time).toFixed(3));

            
            if (item.index === 6) {
                start = set[1].time;
                t.ok((item.time - start) > 5 * 16, 'should take at least 5 (80ms) frames of clock time; actual: ' + (item.time - start).toFixed(3));
                t.ok(set.every(function (item, index) {
                    var next = set[index + 1];
                    if (next) {
                        return item.time < next.time;
                    }
                    return true;
                }), 'callbacks executed in order');
                t.end();
                return;
            }
            rifraf.request(tick);
        }
        rifraf.request(function () {
            start = performance.now();
            rifraf.request(tick);
        });
    });
    test('#delay allows syncing to <60fps frame rates', function (t) {
        t.plan(7);
        var set = get7();
        var i = 0;
        var start;
        rifraf.sync30Hz();
        function tick(dt) {
            var prev = set[i-1];
            var item = set[i++];
            item.time = performance.now();
            if (prev && i > 2) t.ok((item.time - start) >= 0, 'time has passed: ' + (item.time - prev.time).toFixed(3));

            
            if (item.index === 6) {
                start = set[1].time;
                t.ok((item.time - start) > 5 * 33, 'should take at least 5 (160ms) frames of clock time; actual: ' + (item.time - start).toFixed(3));
                t.ok(set.every(function (item, index) {
                    var next = set[index + 1];
                    if (next) {
                        return item.time < next.time;
                    }
                    return true;
                }), 'callbacks executed in order');
                t.end();
                return;
            }
            rifraf.delay(tick);
        }
        rifraf.request(function () {
            start = performance.now();
            rifraf.delay(tick);
        });
    });
} else {
    test('request defers approximately 8ms by default', function (t) {
        t.plan(2);
        var set = get7();
        var i = 0;
        var start = now();

        function tick() {
            var item = set[i++];
            item.time = now();

            if (item.index === 6) {
                start = set[1].time;
                t.ok((item.time - start) > 5 * 8, 'total time > 5 * 8ms; actual(' + (item.time - start).toFixed(3) + ')');
                t.ok(set.every(function (item, index) {
                    var next = set[index + 1];
                    if (next) {
                        return item.time < next.time;
                    }
                    return true;
                }), 'callbacks executed in order');
                t.end();
                return;
            }
            rifraf.request(tick);
        }
        rifraf.request(tick);
    });

    test('request defers approximately 16ms when sync60Hz is called', function (t) {
        rifraf.sync60Hz();
        t.plan(2);
        var set = get7();
        var i = 0;
        var start = now();

        function tick() {
            var item = set[i++];
            item.time = now();
            if (item.index === 6) {
                start = set[1].time
                t.ok((item.time - start) > 5 * 16, 'total time > 5 * 16ms; actual(' + (item.time - start).toFixed(3) + ')');
                t.ok(set.every(function (item, index) {
                    var next = set[index + 1];
                    if (next) {
                        return item.time < next.time;
                    }
                    return true;
                }), 'callbacks executed in order');
                t.end();
                return;
            }
            rifraf.request(tick);
        }
        rifraf.request(tick);
    });

    test('request defers approximately 33ms when sync30Hz is called', function (t) {
        rifraf.sync30Hz();
        t.plan(2);
        var set = get7();
        var i = 0;
        var start = now();

        function tick() {
            var item = set[i++];
            item.time = now();
            if (item.index === 6) {
                start = set[1].time;
                t.ok((item.time - start) > 5 * 33, 'total time > 5 * 33ms; actual(' + (item.time - start).toFixed(3) + ')');
                t.ok(set.every(function (item, index) {
                    var next = set[index + 1];
                    if (next) {
                        return item.time < next.time;
                    }
                    return true;
                }), 'callbacks executed in order');
                t.end();
                return;
            }
            rifraf.request(tick);
        }
        rifraf.request(tick);
    });
}

test('callbacks can be cancelled', function (t) {

    function one() { one.called = true; }
    function two() { two.called = true; }
    function three() { three.called = true; }

    one.handle = rifraf.request(one);
    two.handle = rifraf.request(two);
    three.handle = rifraf.request(three);

    t.ok([one, two, three].every(function (fn) {
        return fn.handle;
    }), 'rifraf.request returns a handle');

    rifraf.cancel(two.handle);

    rifraf.request(function () {
        t.ok(one.called, 'callback one was called');
        t.notOk(two.called, 'callback two was not called');
        t.ok(three.called, 'callback three was called');
        t.end();
    });
});