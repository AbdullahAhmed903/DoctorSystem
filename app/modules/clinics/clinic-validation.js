
import joi from "joi";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const updateClinicSchema = {
   body: joi.object().required().keys({
  name: joi.string().min(2),
 contactNumber: joi.string()
  .pattern(/^[0-9]{10,15}$/)
  .messages({
    "string.base": "contactNumber must be a string",
    "string.pattern.base": "contactNumber is not a valid phone number"
  }),

  status: joi.string().valid("active","inactive","closed"),

  address: joi.object({
    city: joi.string(),
    street: joi.string(),
    building: joi.string(),
    floor: joi.string()
  }),

  weeklySchedule: joi.array().items(
    joi.object({
      _id: joi.string().required(),

      day: joi.string().valid(
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
      ),

      startTime: joi.string().pattern(timeRegex),
      endTime: joi.string().pattern(timeRegex),
      crossMidNight: joi.boolean()
    })
    .custom((value, helpers) => {
      if (
        value.startTime &&
        value.endTime &&
        value.startTime >= value.endTime &&
        !value.crossMidNight
      ) {
        return helpers.error("any.invalid");
      }
      return value;
    })
  )
})
}







const weeklyScheduleSchema = joi.object({
  day: joi.string()
    .valid(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    )
    .required(),
  startTime: joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  endTime: joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  crossMidnight: joi.boolean().default(false)
});

const feesSchema = joi.object({
  currency: joi.string().valid("$", "€", "£", "¥", "egp").default("egp"),
  amount: joi.number().min(0).required()
});

// Address joi schema
const addressSchema = joi.object().required().keys({
  city: joi.string().max(100).required(),
  street: joi.string().max(100).required(),
  building: joi.string().max(50).required(),
  floor: joi.string().max(50).required()
});

export const addClinicValidation = {
  body: joi.object().required().keys({
    name: joi.string().min(2).max(100).required(),
    address: addressSchema.required(),
    contactNumber: joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Contact number must be 10-15 digits, optionally starting with +"
      }),
    fees: feesSchema.required(),
    status: joi.string().valid("active", "inactive", "closed").default("inactive"),
    isDeleted: joi.boolean().default(false),
    weeklySchedule: joi.array().items(weeklyScheduleSchema),
  })
};


