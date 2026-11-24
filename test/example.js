/* Copyright (c) 2015-2026 Richard Rodger and other contributors, MIT License */
'use strict'

// The README example. Run: node test/example.js

const Seneca = require('seneca')

async function main() {
  // In your own project write .use('@seneca/registry').
  const seneca = Seneca({ log: 'warn' }).use(require('..'))

  try {
    await seneca.ready()

    await seneca.post('role:registry,cmd:set,key:color,value:red')
    const color = await seneca.post('role:registry,cmd:get,key:color')
    console.log(color.value) // red

    await seneca.post('role:registry,cmd:set,key:x,value:1')
    await seneca.post('role:registry,cmd:set,key:x/u,value:2')
    await seneca.post('role:registry,cmd:set,key:x/v,value:3')
    await seneca.post('role:registry,cmd:set,key:x/v/y,value:4')

    const children = await seneca.post('role:registry,cmd:list,key:x')
    console.log(children.keys) // [ 'u', 'v' ]

    const all = await seneca.post('role:registry,cmd:list,key:x,recurse:true')
    console.log(all.keys) // [ 'u', 'v', 'v/y' ]
  } finally {
    await seneca.close()
  }
}

main().catch(function (err) {
  console.error(err)
  process.exitCode = 1
})
