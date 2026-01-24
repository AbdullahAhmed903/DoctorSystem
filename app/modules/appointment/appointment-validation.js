import joi from "joi";



export const cancelAppintment={
  body:joi.object().required().keys({
    cancelDate:joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({
      "string.pattern.base":"Date must be in YYYY-MM-DD format"
    })
  })
}


export const bookAppointmentValidation={
  body:joi.object().required().keys({
    doctorId:joi.string().required(),
    date:joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({
      "string.pattern.base":"Date must be in YYYY-MM-DD format"
    }),
    startTime:joi.string().required().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
      "string.pattern.base":"Start time must be in HH:MM format"
    }),
    endTime:joi.string().required().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
      "string.pattern.base":"End time must be in HH:MM format"
    }),
    typeOfPayment:joi.string().valid("cash", "credit_card", "insurance", "online_payment").optional(),
    reasonForVisit:joi.string().optional(),
    notes:joi.string().optional()
  }),
  params:joi.object().required().keys({
    clinicId:joi.string().required()
  })
}


export const updateAppointmentStatusValidation={
  params:joi.object().required().keys({
    appointmentId:joi.string().required()
  }),
  body:joi.object().required().keys({
    status:joi.string().valid("pending", "confirmed", "cancelled", "completed").required()
  })
}


