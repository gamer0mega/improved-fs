# Improved FS
## How Does it Work?
All The Actions are being sent to a **fork** of The Process, Which Performs all The Actions Using The Default FS and returns The Result in a Promise.

This is not the fastest way, but it is useful if You need to extract a Buffer from a large media file on a project such as a Discord Bot, without preventing other Events from stopping until The FS Finishes reading The File, Even with The Callback API.

## Methods
All The Synchronious Methods are being Automatically imported from The Default FS module But Without `Sync`.

Default Method: `ImprovedFS.execute(MethodName, ...arguments)`
```JavaScript
console.log(await require('improved-fs').execute('readdir', '/path/to/dir'));
```
## Example Usage - Eris
```JavaScript
// Import Improved FS
const fs = require('improved-fs');
// Create The Command Export(aka Basic Command Handler)
module.exports = {
  name: 'video',
  description: 'Sends out a Demonstration Video for improved-fs.'
  async execute(message, args, client) {
    // Await The File Being Read. Does Not Block The Event Loop.
    const fileBuffer = await fs.readFile('/path/to/file.mp4')
    .catch(error => {
      // In Case an Error Occurs while Reading The File.
      return message.channel.createMessage("Whoops! Something Went wrong While Reading The Video File! Please Make Sure The Bot's Process has sufficient permissions and The File exists.```JavaScript\n" + error.toString() + "\n```");
    });
    // Send Out The Result.
    return message.channel.createMessage(
      "There You Go!",
      {
        file: fileBuffer,
        name: "file.mp4"
      }
    );
  }
};
```
### The Same Code but Using The Default FS Module
```JavaScript
// Import FS
const fs = require('fs');
// Create The Command Export(aka Basic Command Handler)
module.exports = {
  name: 'video',
  description: 'Sends out a Demonstration Video for fs.'
  async execute(message, args, client) {
    // Await The File Being Read and returned in The Callback. Does Block The Event Loop.
    fs.readFile('/path/to/file.mp4', function bufferReceivedCallback(error, fileBuffer) {
      // In Case an Error Occurs while Reading The File.
      if(error) return message.channel.createMessage("Whoops! Something Went wrong While Reading The Video File! Please Make Sure The Bot's Process has sufficient permissions and The File exists.```JavaScript\n" + error.toString() + "\n```");
      // Send Out The Result.
      return message.channel.createMessage(
        "There You Go!",
        {
          file: fileBuffer,
          name: "file.mp4"
        }
      );
    });
  }
};
```
Need Support? Feel Free to Join our [Discord Server](https://discord.gg/jnzkPmukuv)!
