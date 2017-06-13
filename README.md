# seneca-registry

## Seneca service registry (simplistic single instance).

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


## Usage

Keys are strings of the form: _a/b/c_ where each _/_ defines a branch
of a tree. In simple cases, you can treat keys as simple identifiers
and ignore this tree structure. In more complex cases you can use the
tree structure as a namespace mechanism. In particular, you can remove
and list keys recursively.


```js
require('seneca')()
  .use('registry')
  .start()

  .wait('role:registry,cmd:set,key:x,value:1')
  .wait('role:registry,cmd:set,key:x/u,value:2')
  .wait('role:registry,cmd:set,key:x/v,value:3')
  .wait('role:registry,cmd:set,key:x/v/y,value:4')

  .wait('role:registry,cmd:list,key:x')
  .step(function(data){
    console.log( data.keys ) // == [ 'u', 'v' ]
    return true;
  })

  .wait('role:registry,cmd:list,key:x,recurse:true')
  .step(function(data){
    console.log( data.keys ) // == [ 'u', 'v', 'v/y' ]
    return true;
  })

  .end()
```

## Action Patterns


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
