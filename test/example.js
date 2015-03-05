require('seneca')()
  .use('..')
  .start()

  .wait('role:registry,cmd:set,key:color,value:red')
  .wait('role:registry,cmd:get,key:color')
  .step(function(data){
    console.log( data.value ) // == "red"
    return true;
  })

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
