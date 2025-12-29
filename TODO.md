# Task: Merge Three Appointment Endpoints into One

## Steps to Complete
- [ ] Create a new function `updateAppointmentStatus` in `appointment.controller.js` that handles status updates for confirm, cancel, and complete based on the `status` body parameter.
- [ ] Fix the typo in the original `cofirmAppointment` function name and correct the response message in `completeAppointment`.
- [ ] Update exports in `appointment.controller.js` to include `updateAppointmentStatus` and remove the old three functions.
- [ ] Update `appointment-router.js` to replace the three separate PATCH routes with a single route `/doctor/appointments/:appointmentId` pointing to `updateAppointmentStatus`.
- [ ] Verify the changes by checking the files and ensuring no syntax errors.
