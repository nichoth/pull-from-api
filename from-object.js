var fromFn = require('./')

function fromObject (obj) {
    return Object.keys(obj).reduce(function (acc, k) {
        var fn = obj[k]
        acc[k] = fromFn(fn, k)
        return acc
    }, {})
}

module.exports = fromObject
