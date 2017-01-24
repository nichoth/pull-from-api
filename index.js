var S = require('pull-stream/pull')
var map = require('pull-stream/throughs/map')
var cat = require('pull-cat')
var async = require('pull-async')
var Catch = require('pull-catch')
var Ev = require('event-manifest/event')

function fromFn (fn, op) {
    op = op || null
    return function () {
        var args = Array.prototype.slice.call(arguments)
        var stream = async(function (cb) {
            fn.apply(null, args.concat(cb))
        })
        return cat([
            S.once(Ev('start', { args: args, op: op })),
            S(
                stream,
                map(function (resp) {
                    return Ev(op || 'data', resp)
                }),
                Catch(function onErr (err) {
                    return Ev('error', err)
                })
            ),
            S.once(Ev('resolve', { args: args, op: op }))
        ])
    }
}

module.exports = fromFn

