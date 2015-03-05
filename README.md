# seneca-registry

### Seneca service registry (simplistic single instance). 

This plugin module provides a simplistic service registry based on a
key-value store interface. This is similar to the interface provided
by Consul, etcd and Zookeeper.  The keys are organized into a tree
structure.

IMPORTANT: this plugin does *not* provide a distributed
implementation. It merely provides an message pattern interface and an
in-memory implementation, primarily for unit-testing purposes.

This module is a Seneca plugin. For a gentle introduction to Seneca
itself, see the [senecajs.org](http://senecajs.org) site.


### Support

If you're using this module, feel free to contact me on twitter if you
have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.1.0

Tested on: Node 0.10.36, Seneca 0.6.1

[![Gitter chat](https://badges.gitter.im/rjrodger/seneca-registry.png)](https://gitter.im/rjrodger/seneca-registry)

[![Build Status](https://travis-ci.org/rjrodger/seneca-registry.png?branch=master)](https://travis-ci.org/rjrodger/seneca-registry)

[Annotated Source Code](http://rjrodger.github.io/seneca-registry/doc/registry.html).



### Quick Example

Get and set a key

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



