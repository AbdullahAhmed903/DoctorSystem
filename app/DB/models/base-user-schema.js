import bcrypt from 'bcryptjs';
import CONFIG from '../../../config/config.js';

export const createBaseUserSchema = () => {
  return {
    email: {
      type: String,
      required: true,
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
    
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    isEmailVerified: { type: Boolean, default: false },
    encryptedPassword: { type: String ,select:false},
    phone: {
      type: [String],
      required: true,
      validate: {
        validator: v => v.every(num => /^[0-9]{10,15}$/.test(num)),
        message: props => `${props.value} is not a valid phone number`
      }
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    isDeleted: { type: Boolean, default: false },
    profileImage: String,
  };
};

export const addPasswordVirtual = (schema) => {
  schema.virtual("password")
    .set(function(password) {
      this.encryptedPassword = bcrypt.hashSync(password, Number.parseInt(CONFIG.BCRYPT_SALT_ROUNDS));
    })
    .get(function() {
      return this.encryptedPassword;
    });
};