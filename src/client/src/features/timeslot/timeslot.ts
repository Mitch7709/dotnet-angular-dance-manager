import { Component, inject, signal } from '@angular/core';
import { TimeslotService } from '../../core/services/timeslot-service';
import { TimeSlotResponse } from '../../types/DTOs/TimeSlotDTOs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timeslot',
  imports: [FormsModule],
  templateUrl: './timeslot.html',
  styleUrls: ['./timeslot.css'],
})
export class Timeslot {
  private timeslotService = inject(TimeslotService);

  timeSlots = signal<TimeSlotResponse[] | null>(null);
  selectedTimeSlot = signal<TimeSlotResponse | null>(null);

  ngOnInit() {
    this.loadTimeSlots();
  }

  loadTimeSlots() {
    this.timeslotService.getAll().subscribe((timeslots) => {
      this.timeSlots.set(timeslots);
      // console.log(timeslots);
    });
  }

  openEditDialog(slot: TimeSlotResponse) {
    this.selectedTimeSlot.set({ ...slot})
    const dialog = document.getElementById('timeslot-dialog') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeDialog() {
    const dialog = document.getElementById('timeslot-dialog') as HTMLDialogElement;
    dialog?.close();
    this.selectedTimeSlot.set(null);
  }

  saveEdit() {
    const slot = this.selectedTimeSlot();
    if (!slot) return;

    this.timeslotService.update(slot.id, {
      startTime: slot.startTime,
      durationInMinutes: slot.durationInMinutes,
      dayOfWeek: slot.dayOfWeek,
      isActive: slot.isActive
    }).subscribe(() => {
      this.loadTimeSlots();
      this.closeDialog();
    });
  }

  deleteTimeSlot(id: number) {
    if (confirm('Are you sure you want to delete this time slot?')) {
      this.timeslotService.delete(id).subscribe(() => {
        this.loadTimeSlots();
      });
    }
  }
}
