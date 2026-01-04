import mongoose from "mongoose";




const clinicSchema= new mongoose.Schema({
    clinicId:{
        type:String,
        required:true,
        unique:true,
        index: true
        
    },
    doctorId:{
        type:String,
        required:true
    },
    name: { type: String, required: true, trim: true, minlength: 2 },

    address: {
    city: String,
    street: String,
    building: String,
    floor: String
    },

    contactNumber: {
    type: String,
    required: true,
    validate: {
    validator: v => /^\+?[0-9]{10,15}$/.test(v),
    message: v => `${v} is not a valid phone number`
    }
    },

    fees: {
    currency: {
        type: String,
        enum: ["$", "€", "£", "¥"],
        default: "$"
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
    },

    status: {
    type: String,
    enum: ["active", "inactive", "closed"],
    default: "inactive"
  },
    isDeleted:{type:Boolean,default:false},

    weeklySchedule: [
    {
    day: {
        type: String,
        enum: [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
        ],
        },
        startTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
        },
        endTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
        crossMidnight: { type: Boolean, default: false },
        _id:0
    }
    ],
    


},{
    timestamps:true
})



const clinicModel=mongoose.model("clinics",clinicSchema)


export default clinicModel