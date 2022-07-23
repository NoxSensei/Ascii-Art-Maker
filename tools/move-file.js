var fs = require('fs')

var oldPath = process.argv[2]
var newPath = process.argv[3]

fs.rename(oldPath, newPath, function (err) {
    if (err) throw err
    console.log('Successfully renamed - AKA moved!')
})
