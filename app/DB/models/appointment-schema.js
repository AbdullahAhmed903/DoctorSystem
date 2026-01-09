import mongoose from "mongoose";
import { validate } from "uuid";

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true, required: true },

  doctorId: { type: String, required: true},
  patientId: { type: String, required: true },
  clinicId: { type: String, required: true },

  date: { type: String, required: true ,
    validate:{
      validator:function(v){
        return  /^\d{4}-\d{2}-\d{2}$/.test(v)
      },
      message:props=>`${props.value} /Validate date format (YYYY-MM-DD) `
    }
  }, 

  startTime: { type: String, required: true,
      validate:{
      validator:function(v){
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v)
      },
      message: props => `${props.value} Invalid time format. Use HH:MM`
    }

   }, 
  endTime: { type: String, required: true,
     validate:{
      validator:function(v){
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v)
      },
      message: props => `${props.value} Invalid time format. Use HH:MM`
    }
   },
  //  startMinutes:Number,
  //  endMinutes:Number,

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  },

  fees: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "$" }
  },

  typeOfPayment: {
    type: String,
    enum: ["cash", "credit_card", "insurance", "online_payment"],
    default: "cash"
  },

  reasonForVisit: { type: String },
  notes: { type: String },

  createdBy: { type: String, enum: ["doctor", "patient"] },
  stripeSessionId:{type:String}

}, { timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  });



  
appointmentSchema.virtual("clinicDetails",
{
ref:"clinics",
localField:"clinicId",
foreignField:"clinicId"
})

appointmentSchema.virtual("patientDetails",
{
ref:"Patient",
localField:"patientId",
foreignField:"patientId"
})

appointmentSchema.virtual("doctorDetails",
{
ref:"Doctor",
localField:"doctorId",
foreignField:"doctorid"
})
const appointmentModel=mongoose.model("Appointment",appointmentSchema);

export default appointmentModel;