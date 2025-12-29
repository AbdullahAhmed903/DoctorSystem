import mongoose from "mongoose";



const emailUpdateSchema = new mongoose.Schema({
  doctorId: String,
  oldEmailCode: String,
  newEmailCode: String,
  newEmail: String,

  expiresAt: {
    type: Date,
    default: () => Date.now() + 1 * 60 * 1000, // 10 mins
    index: { expires: 60 } // auto delete after 600 seconds
  }
});

const EmailUpdate = mongoose.model('EmailUpdate', emailUpdateSchema);

export default EmailUpdate;
