
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

  status: joi.boolean(),

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