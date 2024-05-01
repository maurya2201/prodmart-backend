import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  mobile:{
    type:Number,
    require:true
  },
  gender:{
    type:String, 
    require:true
  },
  otp:{
    type:Number,
    require:true
  },
  isUser:{
    type:Boolean,
    require:true
  },
  state:{
    type:Boolean,
    require:true
  }
},{
  versionKey: false 
});
export default mongoose.model("User",userSchema);