import { Component, inject, signal } from '@angular/core';
import { TimeslotService } from '../../core/services/timeslot-service';
import { TimeSlotResponse } from '../../types/DTOs/TimeSlotDTOs';

@Component({
  selector: 'app-timeslot',
  imports: [],
  templateUrl: './timeslot.html',
  styleUrls: ['./timeslot.css'],
})
export class Timeslot {
  private timeslotService = inject(TimeslotService);

  timeSlots = signal<TimeSlotResponse[] | null>(null);

  ngOnInit() {
    this.loadTimeSlots();
  }

  loadTimeSlots() {
    this.timeslotService.getAll().subscribe((timeslots) => {
      this.timeSlots.set(timeslots);
      console.log(timeslots);
    });
  }
}
