import mongoose from "mongoose";



const TokenSchema=mongoose.Schema({
  doctorId:{type:String,unique:true,required:false},
  patientId:{type:String,unique:true,required:false},
  token:{type:String,required:false},
},{
    timestamps:true
})

const tokenSchema= mongoose.model("Token", TokenSchema);

export default tokenSchema;
