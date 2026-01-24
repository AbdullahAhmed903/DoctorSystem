import joi from "joi";




export const updateEmailRequestValidation = {
  body: joi.object().required().keys({
    newEmail: joi.string().email().required().pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.(com|mail)$/).messages({
      "string.pattern.base": "newEmail is not a valid email address"
    })  
  })
}


export const emailUpdateValidation = {
  body: joi.object().required().keys({
    oldEmailCode: joi.string().required(),
    newEmailCode: joi.string().required()
  })
}
