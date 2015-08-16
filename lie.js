var Promise = require('bluebird'),
    Worker  = require('webworker-threads').Worker;

function addOne(num) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(num + 1);
        }, 500);
    });
}

function depromise(fn) {
    return function() {
        var retval = {
                val: 10
            },
            worker,
            args = [].slice.call(arguments),
            finished = false;

        worker = new Worker(function() {
            console.log('in a worker');
            self.addEventListener('message', function(e) {
                console.log('main said ' + e.data.val);
                e.data.val = 73;
                self.postMessage('yo');
            }, false);

            console.log(retval);
            finished = true;
            /*
            fn.apply(fn, args)
            .then(function(result) {
                
            });
            */
            //self.close();
        });

        worker.addEventListener('message', function(e) {
          console.log('Worker said: ', e.data);
          console.log('retval is still ' + retval.val);
        }, false);

        worker.postMessage(retval);

        /*while (!finished) {
            console.log(retval.val);
        }*/

        return fn.apply(fn, [].slice.call(arguments));
        //return retval;
    };
}

depromise(addOne)(3).then(function(val) {
    console.log(val);
});
