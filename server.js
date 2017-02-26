var express=require('express');
var mongoose=require('mongoose');
var noCache = require('connect-nocache')();
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser=require('cookie-parser');

mongoose.connect('mongodb://nithinreddygajjala:Ravinder8!@ds145168.mlab.com:45168/meetupplanner');
var app=express();
app.set('port', (process.env.PORT || 3000));
app.use(session({ secret: 'this is secret',
    // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
 }));


app.use(cookieParser());
app.use(passport.initialize());
   app.use(passport.session());
var path=require('path');
var morgan= require('morgan');
var bodyParser=require('body-parser');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.get('/',express.static(__dirname+'public'));
app.use(express.static(path.join(__dirname,'public')));
//app.get('/hi',function(req,res){
  //console.log('listening to the /');
//});

passport.use(new LocalStrategy(function(username,password,done){

  appuser.find({username:username},function(err,user){
    if(user[0]==undefined){
      return done(null,false);

    }
    else{
    if(user[0].password==password){

        return done(null,{username:username});
      }
      else{
        return done(null,false);
      }
}
  });


}));

passport.serializeUser(function(user, done) {
    done(null, user);

});


passport.deserializeUser(function(user, done) {

        done(null, user);
    });




var Schema = mongoose.Schema;

var RSVP=new Schema({
  name :{type:String,required:true},
  mail:{type:String}
});

var userSchema = new Schema({
  eventname: {type:String,required:true,unique:true},
  eventowner: { type: String, required: true },
  startdate: { type: Date, required: true },
  enddate:{ type: String },
  location: String,
  time:String,
  attendance:Number,
  members:[],
  created_at:Date,
  created_by:String


});


var User = mongoose.model('meet4', userSchema);

var userdata=new mongoose.Schema({
  username:{type:String,required:true,unique:true} ,
  password:{type:String,required:true},
  events:[]
});
var appuser= mongoose.model('userprofile', userdata);


app.post('/adddata',auth,function(req,res){
  console.log(req.body);

  var newUser = User({
    eventname: req.body.eventname,
    eventowner: req.body.eventowner,
    startdate: req.body.startdate,
    location: req.body.place,
    time:req.body.time,
    attendance:0,
    created_at:new Date(),
    created_by:req.user.username
  });

  newUser.save(function(err) {
    if (err) throw err;

    console.log('saved');
  });
  res.redirect('/#/index2');
  res.end('');

});
app.get('/getdata',function(req,res){
var k={};
  User.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
res.send(JSON.stringify(users));


  });

});

app.post('/login',passport.authenticate('local'),function(req,res,next){
console.log(req.isAuthenticated());
  if(req.isAuthenticated()){
  res.redirect('/#/index2');
}
else{

}
  res.end();
  next();
});
app.get('/check',function(req,res){

console.log(req.isAuthenticated());
res.send(req.isAuthenticated());
  res.end();
});
app.get('/loggedinuser',function(req,res){


res.send(req.user);
  res.end();
});
app.get('/auth',function(req,res,next){




    req.logout();



  res.end();
});

function auth(req,res,next){

  if(req.isAuthenticated()){
    console.log(req.isAuthenticated());
    next();
  }
  else{
    console.log('rejected');
  return;
  }
}
app.post('/register',function(req,res){


var x=new appuser({
  username:req.body.username,
  password:req.body.password
});
x.save(function(err){
  if(err) throw err;
   console.log(' user registered');
});

  res.redirect('/');
  res.end();
});

app.delete('/removersvp',function(req,res){
  console.log(req.body.data);
  var g;
  User.find({eventname:req.body.data},function(err,data){
for(var i=0;i<data[0].members.length;i++){
  if(data[0].members[i].name==req.user.username){
    g=i;
  }
}
console.log(data[0].attendance);
data[0].members.splice(g,1);
data[0].attendance=data[0].attendance-1;

console.log(data[0]);
data[0].save(function(err){
  if(err) throw err;
  else {
    console.log('rsvp removed ');

  }
});
appuser.find({username:req.user.username},function(err,user){
  var g;
  for(var i=0;i<user[0].events.length;i++){
    if(user[0].events[i]==req.body.data){
      g=i;
    }
  }
user[0].events.splice(g,1);
console.log(user[0]);
user[0].save(function(err){
  if(err) throw err;
  else {
    console.log('rsvp removed ');

  }
});
});





  });
  res.end();
});

app.delete('/delete',function(req,res){
  console.log(req.body);
  User.find({ _id: req.body.data}, function(err, user) {
  if (err) throw err;

  // delete him
  //console.log(user);
  user[0].remove(function(err) {
    if (err) throw err;

    console.log('event successfully deleted!');
  });

  appuser.find({},function(err,user1){
    for(var i=0;i<user1.length;i++){
      //console.log(user1[i].events);
        var g;
      for(var k=0;k<user1[i].events.length;k++){
        if(user1[i].events[k]==user[0].eventname){
          g=k;
        }

      }
//console.log(user1[i].events[g]);
if(g!=undefined){
user1[i].events.splice(g,1);
user1[i].save(function(err){
  if(err) throw err;
  console.log('save2');
});
}

    }
console.log(user1);

  });

});


  res.end();
});


app.get('/test',auth,function(req,res){


  User.find({created_by:req.user.username},function(err,user){
    if(err) throw err;

res.send(user);
  })

});

app.get('/tester',auth,function(req,res){
  appuser.find({username:req.user.username},function(err,user){
    if(err) throw err;
    res.send(user);
    res.end();
  });
});


app.post('/attendance',function(req,res){



  User.find({ _id:req.body.id}, function(err, user) {
  if (err) throw err;



var x=0;
for(i=0;i<user[0].members.length;i++){
  if(user[0].members[i].name==req.user.username){

    x++;
  }
}



user[0].members.push({
        name: req.user.username,

    });
    user[0].attendance=user[0].attendance+1;
    if(x>0){
console.log('user already exists');
}
else{
  var x1=0;
  appuser.find({username:req.user.username},function(err,user1){
for(i=0;i<user1[0].events.length;i++){
  if(user1[0].events[i]==user[0].eventname){
    x1++;
  }
}

    console.log(user1[0].events.length);
    user1[0].events.push(user[0].eventname) ;
    if(x1>0){
     }
    else{
    user1[0].save(function(err){
      if(err) throw err
    });
  }

  });


  user[0].save(function(err) {
     if (err) throw err;

     console.log('User successfully updated!');
   });
}
});




  res.end();

});
app.listen(app.get('port'),function(req,res){
  console.log('listening to the port 3000');
});
