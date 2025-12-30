import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },

  purpose: {
    type: String,
    enum: ["VERIFY_EMAIL", "FORGET_PASSWORD", "CHANGE_EMAIL"],
    required: true
  },

  code: {
    type: String, // hashed
    required: true
  },

  expiresAt: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

verificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);


const verificationModel = mongoose.model("Verification", verificationSchema);
export default verificationModel;