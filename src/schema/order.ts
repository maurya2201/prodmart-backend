import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  uid:{
    type:String,
    require:true
  },
  title:{
    type:String,
    require:true
  },
  quantity:{
    type:Number,
    require:true
  },
  thumbnail:String,
  totalprice:Number
},{
  versionKey: false 
});
export default mongoose.model("Order",orderSchema);