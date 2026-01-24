import clinicModel from "../../../DB/models/clinic-schema.js"
import { CustomError } from "../../../middlewares/error-handling.js"
import { constants } from "../../../utils/utills-service.js"


export const checkExistingClinic=async({clinicId,doctorId})=>{
        const checkClinic=await clinicModel.findOne({clinicId,doctorId,isDeleted:false}).lean()
        if(!checkClinic){
        throw new CustomError("Clinc Not Available",constants.RESPONSE_BAD_REQUEST)
        }
        return checkClinic
}





export class UpdateFields{
     constructor(clinicModel,body) {
    this.clinicModel = clinicModel;
    this.body = body;
  }

  async updateNormalObject(clinicId,doctorId){
        const update={}
        const allowedFields=["name","contactNumber","status"]
                allowedFields.forEach(field => {
                    if(this.body[field]!==undefined){
                        update[field]=this.body[field]
                    }
                });
        
                if(this.body.address){
                    for (const key in this.body.address) {
                       update[`address.${key}`]=this.body.address[key]
                    }
                }
                
                     if(this.body.fees){
                    for (const key in this.body.fees) {
                       update[`fees.${key}`]=this.body.fees[key]
                    }
                }
        
                if (Object.keys(update).length) {
                    await this.clinicModel.updateOne(
                    { clinicId, doctorId, isDeleted: false },
                    { $set: update },
                     { runValidators: true }
                    );
                }
  }


  async updateArrayFields(clinicId,doctorId){
         if (Array.isArray(this.body.weeklySchedule) && this.body.weeklySchedule.length) {
            const bulkOps = this.body.weeklySchedule
                .filter(item => item._id)
                .map(item => {
                const { _id: scheduleId, ...fieldsToUpdate } = item;
    
                const setObj = {};
                for (const key in fieldsToUpdate) {
                    setObj[`weeklySchedule.$.${key}`] = fieldsToUpdate[key];
                }
    
                return {
                    updateOne: {
                    filter: {
                        clinicId,
                        doctorId,
                        isDeleted: false,
                        "weeklySchedule._id": scheduleId
                    },
                    update: { $set: setObj }
                    }
                };
                });
    
            if (bulkOps.length) {
                await this.clinicModel.bulkWrite(bulkOps);
            }
            }
  }
}
