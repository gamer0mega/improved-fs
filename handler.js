const fs = require('fs');
process.on('message', function handleMessage(data) {
    try {
        const output = fs[data.action + 'Sync'](...data.args);
        return process.send({
            event: 'data',
            payload: output
        });
    } catch(error) {
        return process.send({
            event: 'error',
            payload: error.toString()
        });
    }
});
process.on('uncaughtException', function fsChildOnUncaughtException(error) {
    return process.send({
        event: 'error',
        payload: error
    });
});
process.on('unhandledRejection', function fsChildOnUnhandledRejection(error) {
    return process.send({
        event: 'error',
        payload: error
    });
});