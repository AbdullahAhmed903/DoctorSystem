import joi from "joi"





// Schema for education and experience arrays
const educationjoiSchema = joi.object({
  degree: joi.string().required(),
  institution: joi.string().required(),
  year: joi.number().integer().min(1900).max(new Date().getFullYear()).required()
});

const experiencejoiSchema = joi.object({
  title: joi.string().required(),
  hospital: joi.string().required(),
  from: joi.date().required(),
  to: joi.date().optional()
});

const addressJoiSchema = joi.object({
  address: joi.string().max(100).required(),
  city: joi.string().max(50).required(),
  state: joi.string().max(50).required(),
  country: joi.string().max(50).required(),
  postalCode: joi.string().max(20).required()
});



export const updateProfileValidation = {
  body:joi.object().keys({
  name: joi.string().min(3).max(30),
  specialization: joi.string().min(3).max(50).strict(),
  gender: joi.string().valid('Male', 'Female', 'Other'),
  age : joi.number().min(20).max(80),
  phone: joi.array().items(joi.string().pattern(/^[0-9]{10,15}$/)).min(1).max(3),
  address: joi.array().items(addressJoiSchema),
  education: joi.array().items(educationjoiSchema),
  experience: joi.array().items(experiencejoiSchema),
  certifications: joi.array().items(joi.string()),
  about: joi.string().max(1000),
  profileImage: joi.string().uri(),
})
}
