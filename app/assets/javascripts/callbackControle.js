CallbackListener = function(callback){
  this.counter = 0;
  this.isActive = false;
  this.callback = callback;
}

CallbackListener.prototype = {
  set: function(){
    var self = this;
    self.counter++;
    return function(){
        self.counter--;
        console.log(self.counter ,  self.isActive ,  self.callback);
        if(self.isActive && self.counter==0 && self.callback)
          self.callback()
      }
  },
  start: function(){
    var self = this;
    self.isActive = true;
     if(self.counter==0 && self.callback) 
       self.callback();
  }
}


CallbackChane = function(){
  this.pos = 0;
  this.tasks = [];
}


CallbackChane.prototype = {
  next: function(){
    var self = this;
    var args = arguments;
    return function() { 
      if(self.tasks[self.pos]){
        self.pos++;
        self.tasks[self.pos - 1](arguments);
        console.log( self.pos , self.tasks[self.pos]  )
      }
    }
  },
  push: function(task){
    this.tasks.push(task); 
  }

}
