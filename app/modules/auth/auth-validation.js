
import joi from "joi"



export const signUpDoctor = {
    body:joi.object().required().keys({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        phone: joi.array().items(joi.string().pattern(/^[0-9]{10,15}$/)).min(1).required(),
        gender: joi.string().valid('Male', 'Female', 'Other').optional(),
        specialization: joi.string().required(),
        experience: joi.number().min(0).optional(),
        certifications: joi.array().items(joi.string()).optional(),
        about: joi.string().max(1000).optional(),
    })
}