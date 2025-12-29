import mongoose from 'mongoose';
import { createBaseUserSchema, addPasswordVirtual } from './base-user-schema.js';

const baseFields = createBaseUserSchema();

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String,index:true, unique: true },
  ...baseFields,
  userType:{type:String,default:"doctor"},
  specialization: { type: String, required: true, index: true },
  experience: { type: Number, default: 0, min: 0 },
  certifications: [String],
  about: { type: String, maxlength: 1000 }
}, { timestamps: true });

addPasswordVirtual(doctorSchema);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;
