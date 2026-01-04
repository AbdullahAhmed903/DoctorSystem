import mongoose from 'mongoose';
import { createBaseUserSchema, addPasswordVirtual } from './base-user-schema.js';

const baseFields = createBaseUserSchema();


const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: Number, required: true }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hospital: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date }
}, { _id: false });


const doctorSchema = new mongoose.Schema({
  doctorId: { type: String,index:true, unique: true },
  ...baseFields,
  userType:{type:String,default:"doctor"},
  specialization: { type: String, required: true, index: true },
  education: [EducationSchema], // array of education objects
  experience: [ExperienceSchema], // array of experience objects
  certifications: [String],
  about: { type: String, maxlength: 1000 }
}, { timestamps: true });

addPasswordVirtual(doctorSchema);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;
