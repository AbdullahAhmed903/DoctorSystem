import mongoose from "mongoose";



const emailUpdateSchema = new mongoose.Schema({
  userId: String,
  oldEmailCode: String,
  newEmailCode: String,
  newEmail: {type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.(com|mail)$/.test(v);
        },
        message: props => `${props.value} is not a valid email address`
      }
  },

  expiresAt: {
    type: Date,
    default: () => Date.now() + 1 * 60 * 1000, // 10 mins
    index: { expires: 60 } // auto delete after 600 seconds
  }
});

const EmailUpdate = mongoose.model('EmailUpdate', emailUpdateSchema);

export default EmailUpdate;
