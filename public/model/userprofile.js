var mongoose=require('mongoose');
var userdata=new mongoose.Schema({
  username:{type:String,required:true} ,
  username:{type:String,required:true}
});
var appuser= mongoose.model('userprofile', userdata);
module.exports=appuser;
