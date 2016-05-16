# Hooks

## onRequire()

Called when the module is required by Caesium.

Nothing is passed to onRequire.

## createPaths(fileObject)

Called when creating the paths object for a file.

Should return an object with the keys `folder` and `targetFile`.

`targetFile` should be the file that will get written to e.g. `/assets/style.css`
`folder` should be the folder mkdirp needs to create before the file can be written e.g. `/assets`

## getComponent(fileObject)

Called to get the component used by react to render the contents.

Needs to return the component class.

## parseFile(fileObject)

Called when parsing the file. Should return a Promise that supports `.then`.

Can either:

 - Write the file itself ([see raw]('../../lib/caesium/modules/raw.js'))
 - Set `fileObject.content` and push the file object to `process.writeQueue` ([see wrap]('../../lib/caesium/modules/wrap.js'))
 - Add a component to `process.bundleModules` in the format `[displayName, fileObject.rawBody]` and add the file object to `process.writeQueue` ([see javascript]('../../lib/caesium/modules/javascript.js'))
