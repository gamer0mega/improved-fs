// Import FS
const fs = require('fs');
// Await The Request Message.
process.on('message', function handleMessage(data) {
    // Try To Execute The Method.
    try {
        const output = fs[data.action + 'Sync'](...data.args);
        // If it Succeeded, Send The Success Message to The Parent.
        return process.send({
            event: 'data',
            payload: output
        });
    } catch(error) {
        // If it Failed(Missing Permissions, ENOENT, etc.), Send The Failure Message to The Parent.
        return process.send({
            event: 'error',
            payload: error.toString()
        });
    }
});
// Monitor Failures Just in Case.
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