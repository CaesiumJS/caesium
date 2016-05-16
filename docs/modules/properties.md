# Properties

## Mandatory Properties

## fileTypes

An array of file types this module is the parser for. Can be empty if you are not providing a parser.

The file types need to have the leading . for example `.js`.

### parseWeight

Sets where in the parse order these files should sit.

The core modules have the following weights:

 - Javascript: 15
 - Markdown: 10
 - Raw: 0
 - Wrap: 10

Can be omitted if you have no file types assigned.

### displayName

A nice name for your module. Used by the `module` front matter attribute so a user can manually select your module.

## Optional Properties
