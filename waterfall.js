const {waterfall} = require('async')

waterfall(
    [
        function(callback){
            callback(null, 7, 5)
        },

        function(arg1, arg2, callback){
            const newNum = arg1 + arg2
            callback(null, newNum)
        },

        function(arg1, callback){
            const res = arg1 * 10
            callback(null, res)
        }
    ],

    function(err, result){
        if (err) return console.log(err)
        console.log(result)
    }
)