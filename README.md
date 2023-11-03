# file-spare

Sparing file storage lib
stores files sparingly avoiding storing the duplicate file contents

To prepare the environment:
npm install

To transpile:
npm run build

To run the code that uses the class:
node dist/test.js

Devops:
The task was a lone class so it cannot be used as it is as a solution. To use as one it should be prefaced with a service API.
But even though we made it, it would not be very useful. And that is because the usage requirement (in the form of the test code) demands that each of the class methods to be a synchronous one, so it blocks the thread, therefore making he service practically unusable for web purposes.
But let us assume we have a useful service above the useful version of this (FS) class. In Azure for example we can use:

- a B-series VM to host our app with the default attached OS Disk (for a relatively small workload and storage data)
- an Azure App Service with a dedicated Disk Storage (for a bigger workload and storage data and for getting a more scalable solution e.g. with multiple service instances)
