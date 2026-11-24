/* Copyright (c) 2015-2026 Richard Rodger and other contributors, MIT License */
'use strict'

const { describe, test } = require('node:test')
const Assert = require('node:assert')

const Seneca = require('seneca')

const Registry = require('..')

async function make_seneca() {
  const seneca = Seneca().test().use(Registry)
  await seneca.ready()
  return seneca
}

describe('registry', function () {
  test('getset', async function () {
    const seneca = await make_seneca()
    const store = seneca.export('registry/store')

    await seneca.post('role:registry,cmd:set,key:k1,value:v1')
    Assert.deepEqual(store(), { k1: { $: 'v1' } })

    const out = await seneca.post('role:registry,cmd:get,key:k1')
    Assert.equal(out.value, 'v1')
    Assert.deepEqual(store(), { k1: { $: 'v1' } })

    const missing = await seneca.post('role:registry,cmd:get,key:k2/m1')
    Assert.equal(missing.value, undefined)

    await seneca.close()
  })

  test('remove', async function () {
    const seneca = await make_seneca()
    const store = seneca.export('registry/store')

    await seneca.post('role:registry,cmd:set,key:k1,value:v1')
    await seneca.post('role:registry,cmd:remove,key:k1')
    let out = await seneca.post('role:registry,cmd:get,key:k1')
    Assert.equal(out.value, undefined)
    Assert.deepEqual(store(), { k1: {} })

    await seneca.post('role:registry,cmd:set,key:k1/m1,value:v2')
    await seneca.post('role:registry,cmd:set,key:k1/m2,value:v3')
    Assert.deepEqual(store(), {
      k1: { m1: { $: 'v2' }, m2: { $: 'v3' } },
    })

    await seneca.post('role:registry,cmd:remove,key:k1/m1')
    out = await seneca.post('role:registry,cmd:get,key:k1/m1')
    Assert.equal(out.value, undefined)
    Assert.deepEqual(store(), { k1: { m1: {}, m2: { $: 'v3' } } })

    out = await seneca.post('role:registry,cmd:get,key:k1/m2')
    Assert.equal(out.value, 'v3')

    await seneca.post('role:registry,cmd:set,key:k3/x/y,value:v4')
    Assert.deepEqual(store().k3, { x: { y: { $: 'v4' } } })

    await seneca.post('role:registry,cmd:remove,key:k3/x,recurse:true')
    out = await seneca.post('role:registry,cmd:get,key:k3/x/y')
    Assert.equal(out.value, undefined)
    out = await seneca.post('role:registry,cmd:get,key:k3/x')
    Assert.equal(out.value, undefined)
    Assert.deepEqual(store().k3, {})

    // Removing an unknown key changes nothing.
    await seneca.post('role:registry,cmd:remove,key:k4/x')
    Assert.deepEqual(Object.keys(store()), ['k1', 'k3'])

    await seneca.close()
  })

  test('list', async function () {
    const seneca = await make_seneca()

    await seneca.post('role:registry,cmd:set,key:k1,value:v1')
    let out = await seneca.post('role:registry,cmd:list,key:k1')
    Assert.deepEqual(out.keys, [])

    await seneca.post('role:registry,cmd:set,key:k1/m1,value:v2')
    await seneca.post('role:registry,cmd:set,key:k1/m2,value:v3')
    out = await seneca.post('role:registry,cmd:list,key:k1')
    Assert.deepEqual(out.keys, ['m1', 'm2'])

    await seneca.post('role:registry,cmd:set,key:k3,value:v4')
    await seneca.post('role:registry,cmd:set,key:k3/x,value:v5')
    await seneca.post('role:registry,cmd:set,key:k3/x/y,value:v6')
    await seneca.post('role:registry,cmd:set,key:k3/x/z,value:v7')
    out = await seneca.post('role:registry,cmd:list,key:k3,recurse:true')
    Assert.deepEqual(out.keys, ['x', 'x/y', 'x/z'])

    // An unknown key has no sub keys.
    out = await seneca.post('role:registry,cmd:list,key:k9')
    Assert.deepEqual(out.keys, [])

    await seneca.close()
  })

  test('each instance has its own store', async function () {
    const s0 = await make_seneca()
    const s1 = await make_seneca()

    await s0.post('role:registry,cmd:set,key:color,value:red')
    const out = await s1.post('role:registry,cmd:get,key:color')
    Assert.equal(out.value, undefined)

    await s0.close()
    await s1.close()
  })

  test('intern', function () {
    const intern = require('..').intern

    Assert.deepEqual(intern.parsekey(), [''])
    Assert.deepEqual(intern.parsekey('a/b'), ['a', 'b'])
  })
})
