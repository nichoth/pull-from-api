# pull from api

Return a stream that emits three events: `start`, `resolve`, and either `data` or `error`.

## example

```js
var test = require('tape')
var S = require('pull-stream')
var fromFn = require('../')
var fromObject = require('../from-object')

function mock (arg, cb) {
    process.nextTick(cb.bind(null, null, arg + ' response'))
}

var testErr = new Error('test')
function mockErr (cb) {
    process.nextTick(cb.bind(null, testErr))
}

test('create stream from function', function (t) {
    t.plan(2)

    var stream = fromFn(mock)('test')
    S(
        stream,
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                ['start', { args: ['test'], op: null}],
                ['data', 'test response'],
                ['resolve', { args: ['test'], op: null}],
            ], 'should return the right events')
        })
    )
})

test('create streams from object', function (t) {
    t.plan(2)
    var fns = {
        foo: mock,
        bar: mock
    }
    var streamFns = fromObject(fns)
    S(
        streamFns.foo('test'),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                ['start', { args: ['test'], op: 'foo'}],
                ['foo', 'test response'],
                ['resolve', { args: ['test'], op: 'foo'}],
            ], 'should namespace with the keys')
        })
    )
})

test('error event', function (t) {
    t.plan(2)
    var stream = fromFn(mockErr)()
    S(
        stream,
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                ['start', { args: [], op: null }],
                ['error', testErr],
                ['resolve', { args: [], op: null }],
            ], 'should return the right events')
        })
    )
})
```

