export class AvailabilityModel {
  id: number;
  startTime: Date;
  endTime: Date;
}

export class UserAvailabilityModel {
  id: number;
  availabilityModels: AvailabilityModel[];
}

export class SchedulerAvailabilityModel extends AvailabilityModel {
  subject = 'Available';
  schedulerId: number | string;

  constructor(availability: AvailabilityModel) {
    super();
    super.id = availability.id;
    super.startTime = availability.startTime;
    super.endTime = availability.endTime;
  }
}
