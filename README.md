![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] plugin

# @seneca/registry

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

This plugin module provides a simplistic service registry based on a
key-value store interface. This is similar to the interface provided
by Consul, etcd and Zookeeper.  The keys are organized into a tree
structure.

IMPORTANT: this plugin does *not* provide a distributed
implementation. It merely provides an message pattern interface and an
in-memory implementation, primarily for unit-testing purposes.

This module is a Seneca plugin. For a gentle introduction to Seneca
itself, see the [senecajs.org](http://senecajs.org) site.

### Seneca compatibility

Supports Seneca versions **3.x** and above.

## Support

If you're using this module, feel free to contact me on twitter if you
have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

[![Gitter chat](https://badges.gitter.im/rjrodger/seneca-registry.png)](https://gitter.im/rjrodger/seneca-registry)

[![Build Status](https://travis-ci.org/rjrodger/seneca-registry.png?branch=master)](https://travis-ci.org/rjrodger/seneca-registry)

[Annotated Source Code](http://senecajs.github.io/seneca-registry/doc/registry.html).

## Install

```sh
npm install seneca-registry
```

## Quick Example

Get and set a key:

```js
require('seneca')()
  .use('registry')
  .start()
  .wait('role:registry,cmd:set,key:color,value:red')
  .wait('role:registry,cmd:get,key:color')
  .step(function(data){
    console.log( data.value ) // == "red"
    return true;
  })
  .end()
```

## More Examples

See [test/](test/) for usage examples.

## Motivation

A simplistic single-instance service registry for Seneca microservices.

## Support

If you're using this module and need help, you can:

- Post a [github issue][]
- Tweet to [@senecajs][]

## API

### Action Patterns

#### `role:registry, cmd:set`

Set the value of a key.

Parameters:

   * key:   string; key name
   * value: any; key value; serialized to JSON

Response: none.


#### `role:registry, cmd:get`

Get the value of a key.

Parameters:

   * key:   string; key name

Response:

   * value: any; key value; deserialized from JSON


#### `role:registry, cmd:list`

List the sub keys of a key, under the tree structure, with _/_ as branch separator.

Parameters:

   * key:     string; key name or partial prefix name of key to query
   * recurse:  boolean, optional, default: false; if true, list all sub keys, if false, list only child keys

Response:

   * keys: array[string]; keys in breadth first order


#### `role:registry, cmd:remove`

Remove the value of a key, and optionally all sub keys.

Parameters:

   * key:     string; key name or partial prefix name of key to remove
   * recurse:  boolean, optional, default: false; if true, remove value and all sub keys, if false, remove only value

Response: none

## Contributing

The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running tests

```sh
npm run test
```

## Background

Useful for simple service discovery in small deployments.

[![Gitter chat](https://badges.gitter.im/rjrodger/seneca-registry.png)](https://gitter.im/rjrodger/seneca-registry)
[![Build Status](https://travis-ci.org/rjrodger/seneca-registry.png?branch=master)](https://travis-ci.org/rjrodger/seneca-registry)
[Annotated Source Code](http://senecajs.github.io/seneca-registry/doc/registry.html).
