/* Copyright (c) 2015 Richard Rodger, MIT License */
"use strict";


// mocha registry.test.js

var util   = require('util')
var assert = require('assert')

var _   = require('lodash')

var seneca = require('seneca')


describe('plugin', function(){

  it('getset', function(fin) {
    var si = seneca({log:'silent'})
    si
      .use('chain')
      .use('..')
      .ready(function() {
        var store = si.export('registry/store')

        si
          .start(fin)

          .wait('role:registry,cmd:set,key:k1,value:v1')
          .step(function(){
            assert.deepEqual(store(), { k1: { '$': 'v1' } })
            return true;
          })

          .wait('role:registry,cmd:get,key:k1')
          .step(function(data){
            assert('v1'==data.value)
            assert.deepEqual(store(), { k1: { '$': 'v1' } })
            return true;
          })

          .end()
      })
  })


  it('remove', function(fin) {
    var si = seneca({log:'silent'})
    si.use('..')
      .use('chain')
      .ready(function() {
        var store = si.export('registry/store')

        si
          .start(fin)

          .wait('role:registry,cmd:set,key:k1,value:v1')
          .wait('role:registry,cmd:remove,key:k1')

          .wait('role:registry,cmd:get,key:k1')
          .step(function(data){
            assert(null==data.value)
            assert.deepEqual(store(), { k1: { } })
            return true;
          })

          .wait('role:registry,cmd:set,key:k1/m1,value:v2')
          .wait('role:registry,cmd:set,key:k1/m2,value:v3')
          .step(function(){
            assert.deepEqual(store(), { k1: { m1: { '$': 'v2' }, m2: { '$': 'v3' } } })
            return true;
          })

          .wait('role:registry,cmd:remove,key:k1/m1')

          .wait('role:registry,cmd:get,key:k1/m1')
          .step(function(data){
            assert(null==data.value)
            assert.deepEqual(store(), { k1: { m1: {}, m2: { '$': 'v3' } } } )
            return true;
          })

          .wait('role:registry,cmd:get,key:k1/m2')
          .step(function(data){
            assert('v3'==data.value)
            return true;
          })

          .wait('role:registry,cmd:set,key:k3/x/y,value:v4')
          .step(function(){
            assert.deepEqual(store().k3, {"x":{"y":{"$":"v4"}}} )
            return true;
          })

          .wait('role:registry,cmd:remove,key:k3/x,recurse:true')

          .wait('role:registry,cmd:get,key:k3/x/y')
          .step(function(data){
            assert(null==data.value)
            return true;
          })

          .wait('role:registry,cmd:get,key:k3/x')
          .step(function(data){
            assert(null==data.value)
            return true;
          })

          .end()
      })
  })


  it('list', function(fin) {
    var si = seneca({log:'silent'})
    si
      .use('..')
      .use('chain')
      .ready(function() {
        var store = si.export('registry/store')

        si
          .start(fin)

          .wait('role:registry,cmd:set,key:k1,value:v1')

          .wait('role:registry,cmd:list,key:k1')
          .step(function(data){
            assert.deepEqual(data.keys,[])
            return true;
          })

          .wait('role:registry,cmd:set,key:k1/m1,value:v2')
          .wait('role:registry,cmd:set,key:k1/m2,value:v3')

          .wait('role:registry,cmd:list,key:k1')
          .step(function(data){
            assert.deepEqual(data.keys,["m1","m2"])
            return true;
          })

          .wait('role:registry,cmd:set,key:k3,value:v4')
          .wait('role:registry,cmd:set,key:k3/x,value:v5')
          .wait('role:registry,cmd:set,key:k3/x/y,value:v6')
          .wait('role:registry,cmd:set,key:k3/x/z,value:v7')

          .wait('role:registry,cmd:list,key:k3,recurse:true')
          .step(function(data){
            assert.deepEqual(data.keys,["x","x/y","x/z"])
            return true;
          })

          .end()
      })
  })

})
