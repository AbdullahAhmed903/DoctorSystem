
import joi from "joi"



export const signUpDoctor = {
    body:joi.object().required().keys({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        phone: joi.array().items(joi.string().pattern(/^[0-9]{10,15}$/)).min(1).required(),
        gender: joi.string().valid('Male', 'Female', 'Other').optional(),
        age: joi.number().min(0).required(),
        specialization: joi.string().required(),
        experience: joi.number().min(0).optional(),
        certifications: joi.array().items(joi.string()).optional(),
        about: joi.string().max(1000).optional(),
    })
}


export const loginDoctor = {
    body:joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const signUpPatient = {
    body:joi.object().required().keys({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        phone: joi.array().items(joi.string().pattern(/^[0-9]{10,15}$/)).min(1).required(),
        gender: joi.string().valid('Male', 'Female', 'Other').required(),
        age: joi.number().min(0).required(),
        address: joi.string().max(500).optional(),
        medicalHistory: joi.array().items(joi.string()).optional(),
    })
}

export const loginPatient = {
    body:joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const refreshToken = {
    body:joi.object().required().keys({
        refreshToken: joi.string().required(),
    })
}


export const verifyEmail = {
    params:joi.object().required().keys({
        token: joi.string().required(),
    })
}


export const forgetpassword={
    body:joi.object().required().keys({
        identifier:joi.string().required(),
        userType:joi.string().valid("doctor","patient").required(),
    })
}


export const resetPassword={
    body:joi.object().required().keys({
        code:joi.string().length(6).required(),
        newpassword:joi.string().min(6).required(),
        repetedNewPassword:joi.string().min(6).required().valid(joi.ref('newpassword')).messages({'any.only':'repetedNewPassword must match newpassword'}),
        identifier:joi.string().required(),
        userType:joi.string().valid("doctor","patient").required(),
    })
}
    
