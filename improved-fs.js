const { fork } = require('child_process');
const fs = require('fs');
module.exports.execute = function improvedFS(action, ...args) {
    if(!action || !fs[action + 'Sync']) throw new RangeError('Invalid Function');
    return new Promise(function awaitFSChild(resolve, reject) {
        const fsChild = fork(__dirname + '/handler.js');
        fsChild.on('message', function fsChildHandlerOnMessage(data) {
            if(!data || !data.event) return;
            switch(data.event) {
                case "error":
                    fsChild.kill();
                    reject(new Error(data.payload.substring('Error: '.length)));
                    break;
                case "data":
                    fsChild.kill();
                    if(data.payload && data.payload.type === 'Buffer') data.payload = Buffer.from(data.payload);
                    resolve(data.payload);
                    break;
            };
        });
        fsChild.send({action, args});
    });
};
for(const action of Object.keys(fs).filter(key => key.endsWith('Sync') && key != 'executeSync').map(key => key.substring(0, key.length - 'Sync'.length))) {
    module.exports[action] = function executeAsyncfsFunction(...args) {
        return module.exports.execute(action, ...args);
    };
    Object.defineProperty(module.exports[action], 'name', {
        value: action,
        writable: false
    });
};