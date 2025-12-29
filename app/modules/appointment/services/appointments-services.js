class AppointmentPipelineStrategy {
  getMatchStage(id) {
    throw new Error("Not implemented");
  }

  getLookupStages() {
    throw new Error("Not implemented");
  }

  getProjectStage() {
    throw new Error("Not implemented");
  }
}



class DoctorAppointmentStrategy extends AppointmentPipelineStrategy{
    getMatchStage(id){
        return {$match:{doctorId:id}}
    }

    getLookupStages(){
        return [
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "patientId",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
    ];
    }

    getProjectStage() {
    return {
      user: {
        name: "$user.name",
        email: "$user.email",
        gender: "$user.gender",
        phone: "$user.phone",
        userRole: "patient"
      },
    };
  }

}



class PatientAppointmentStrategy extends AppointmentPipelineStrategy {
  getMatchStage(id) {
    return { $match: { patientId: id } };
  }

  getLookupStages() {
    return [
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "doctorId",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
    ];
  }

  getProjectStage() {
    return {
      user: {
        name: "$user.name",
        email: "$user.email",
        gender: "$user.gender",
        phone: "$user.phone",
        specialization: "$user.specialization",
        experience: "$user.experience",
        userRole: "doctor"
      },
    };
  }
}



export const AppointmentStrategyFactory = {
  doctor: new DoctorAppointmentStrategy(),
  patient: new PatientAppointmentStrategy()
};



export const appointmentsPipeline = ({
  strategy,
  id,
  skip,
  limit
}) => {

  return [
   strategy.getMatchStage(id),

    ...strategy.getLookupStages(),
    {
      $lookup: {
        from: "clinics",
        localField: "clinicId",
        foreignField: "clinicId",
        as: "clinicDetails"
      }
    },

    { $unwind: { path: "$clinicDetails", preserveNullAndEmptyArrays: true } },

    { $skip: skip },
    { $limit: limit },

    {
      $project: {
        _id: 0,
        appointmentId: 1,
        doctorId: 1,
        patientId: 1,
        clinicId: 1,
        status: 1,
        startTime: 1,
        endTime: 1,

        ...strategy.getProjectStage(),

        clinicName: "$clinicDetails.name",
        clinicCity: "$clinicDetails.address.city",
        clinicStreet: "$clinicDetails.address.street",
        clinicBuilding: "$clinicDetails.address.building",
        clinicFloor: "$clinicDetails.address.floor",
        clinicPhone: "$clinicDetails.contactNumber",
        clinicWeeklySchedule: "$clinicDetails.weeklySchedule"
      }
    }
  ];
};