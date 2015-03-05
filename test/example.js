require('seneca')()
  .use('..')
  .start()
  .wait('role:registry,cmd:set,key:color,value:red')
  .wait('role:registry,cmd:get,key:color')
  .step(function(data){
    console.log( data.value ) // == "red"
    return true;
  })
  .end()
