import mongoose from "mongoose";
import { createBaseUserSchema, addPasswordVirtual } from './base-user-schema.js';

const baseFields = createBaseUserSchema();

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  userType:{type:String,default:"patient"},
  ...baseFields
}, { timestamps: true });

addPasswordVirtual(PatientSchema);

const patientModel = mongoose.model("Patient", PatientSchema);
export default patientModel;