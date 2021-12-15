// Import The Modules.
const { fork } = require('child_process');
const fs = require('fs');
// The Base Execute Method.
module.exports.execute = function improvedFS(action, ...args) {
    // Check if The Method is invalid.
    if(!action || !fs[action + 'Sync']) throw new RangeError('Invalid Function');
    return new Promise(function awaitFSChild(resolve, reject) {
        // Spawns a Fork For Performing The Method.
        const fsChild = fork(__dirname + '/handler.js');
        // Receive Output From The Fork.
        fsChild.on('message', function fsChildHandlerOnMessage(data) {
            // Check in case if The Response is Invalid.
            if(!data || !data.event) return;
            // Use Switch-Case to Detect The Output Type.
            switch(data.event) {
                case "error":
                    // Rejects The Promise if There was an Error.
                    fsChild.kill();
                    reject(new Error(data.payload.substring('Error: '.length)));
                    break;
                case "data":
                    // Resolves The Promise if The Data was Successfully Received.
                    fsChild.kill();
                    // If The Output is a JSON-Encoded Buffer, Parse it Back to a Buffer.
                    if(data.payload && data.payload.type === 'Buffer') data.payload = Buffer.from(data.payload);
                    resolve(data.payload);
                    break;
            };
        });
        // Perform The Request.
        fsChild.send({action, args});
    });
};
// Import Methods from The Default NodeJS FS.
for(const action of Object.keys(fs).filter(key => key.endsWith('Sync') && key != 'executeSync').map(key => key.substring(0, key.length - 'Sync'.length))) {
    module.exports[action] = function executeAsyncfsFunction(...args) {
        return module.exports.execute(action, ...args);
    };
    Object.defineProperty(module.exports[action], 'name', {
        value: action,
        writable: false
    });
};