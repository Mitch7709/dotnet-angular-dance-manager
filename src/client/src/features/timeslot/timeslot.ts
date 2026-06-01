import { Component, inject, signal } from '@angular/core';
import { TimeslotService } from '../../core/services/timeslot-service';
import { TimeSlotRequest, TimeSlotResponse } from '../../types/DTOs/TimeSlotDTOs';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-timeslot',
  imports: [FormsModule],
  templateUrl: './timeslot.html',
  styleUrls: ['./timeslot.css'],
})
export class Timeslot {
  private timeslotService = inject(TimeslotService);
  private toastService = inject(ToastService);

  timeSlots = signal<TimeSlotResponse[] | null>(null);
  selectedTimeSlot = signal<TimeSlotRequest | null>(null);
  originalTimeSlot = signal<TimeSlotResponse | null>(null);

  protected isCreating = signal(false);

  ngOnInit() {
    this.loadTimeSlots();
  }

  loadTimeSlots() {
    this.timeslotService.getAll().subscribe((timeslots) => {
      this.timeSlots.set(timeslots);
      // console.log(timeslots);
    });
  }

  openNewDialog() {
    this.isCreating.set(true);
    this.selectedTimeSlot.set({
      startTime: '00:00',
      durationInMinutes: 0,
      dayOfWeek: 'Monday',
      isActive: true,
    });
    this.openDialog();
  }

  saveNew() {
    const newSlot = this.selectedTimeSlot();
    if (!newSlot) return;

    this.timeslotService.create(newSlot).subscribe({
      next: () => {
        this.loadTimeSlots();
        this.closeDialog();
        this.toastService.success('Time slot created successfully!');
      },
      error: (error) => {
        this.toastService.error(this.getErrorMessage(error, 'Failed to create time slot.'));
      },
    });
  }

  openEditDialog(slot: TimeSlotResponse) {
    this.isCreating.set(false);
    this.originalTimeSlot.set(slot);
    this.selectedTimeSlot.set({ ...slot });
    this.openDialog();
  }

  saveEdit() {
    const slot = this.selectedTimeSlot();
    const original = this.originalTimeSlot();
    if (!slot || !original) return;

    const hasChanges =
      slot.startTime !== original.startTime ||
      slot.durationInMinutes !== original.durationInMinutes ||
      slot.dayOfWeek !== original.dayOfWeek ||
      slot.isActive !== original.isActive;

    if (!hasChanges) {
      this.closeDialog();
      return;
    }

    this.timeslotService.update(original.id, slot).subscribe({
      next: () => {
        this.loadTimeSlots();
        this.closeDialog();
        this.toastService.success('Time slot updated successfully!');
      },
      error: (error) => {
        // console.error('Failed to update time slot:', error);
        this.toastService.error(this.getErrorMessage(error, 'Failed to update time slot.'));
      },
    });
  }

  deleteTimeSlot(id: number) {
    if (confirm('Are you sure you want to delete this time slot?')) {
      this.timeslotService.delete(id).subscribe({
        next: () => {
          this.loadTimeSlots();
          this.toastService.success('Time slot deleted successfully!');
        },
        error: (error) => {
          // console.error('Failed to delete time slot:', error.error);
          this.toastService.error(this.getErrorMessage(error, 'Failed to delete time slot.'));
        },
      });
    }
  }

  openDialog() {
    const dialog = document.getElementById('timeslot-dialog') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeDialog() {
    const dialog = document.getElementById('timeslot-dialog') as HTMLDialogElement;
    dialog?.close();
    this.selectedTimeSlot.set(null);
    this.originalTimeSlot.set(null);
  }

  private getErrorMessage(error: any, fallback: string): string {
    const errors = error.error?.errors as Record<string, string[]> | undefined;
    if (errors) return Object.values(errors).flat().join('\n');
    if (typeof error.error === 'string') return error.error;
    return fallback;
  }
}
