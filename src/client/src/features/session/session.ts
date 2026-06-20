import { Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SessionService } from '../../core/services/session-service';
import { ClasstypeService } from '../../core/services/classtype-service';
import { InstructorService } from '../../core/services/instructor-service';
import { TimeslotService } from '../../core/services/timeslot-service';
import { ClassTypeResponse } from '../../types/DTOs/ClassTypeDTOs';
import { Instructor } from '../../types/DTOs/InstructorDTOs';
import { SessionRequest, SessionResponse } from '../../types/DTOs/SessionDTOs';
import { TimeSlotResponse } from '../../types/DTOs/TimeSlotDTOs';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast-service';
import { getErrorMessage } from '../../core/utils/error-handler';

@Component({
  selector: 'app-session',
  imports: [DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './session.html',
  styleUrl: './session.css',
})
export class Session {
  private sessionService = inject(SessionService);
  private classTypeService = inject(ClasstypeService);
  private instructorService = inject(InstructorService);
  private timeSlotService = inject(TimeslotService);

  private toastService = inject(ToastService);

  sessions = signal<SessionResponse[] | null>(null);
  classTypes = signal<ClassTypeResponse[] | null>(null);
  instructors = signal<Instructor[] | null>(null);
  timeSlots = signal<TimeSlotResponse[] | null>(null);

  selectedSession = signal<SessionRequest | null>(null);
  originalSession = signal<SessionResponse | null>(null);

  isCreating = signal(false);

  ngOnInit() {
    this.loadSessions();
    this.loadClassTypes();
    this.loadInstructors();
    this.loadTimeSlots();
  }

  loadSessions() {
    this.sessionService.getAll().subscribe((sessions) => {
      this.sessions.set(sessions);
      console.log('sessions', sessions);
    });
  }

  loadClassTypes() {
    this.classTypeService.getAll().subscribe((classTypes) => {
      this.classTypes.set(classTypes);
    });
  }

  loadInstructors() {
    this.instructorService.getAll().subscribe((instructors) => {
      this.instructors.set(instructors);
    });
  }

  loadTimeSlots() {
    this.timeSlotService.getAll().subscribe((timeSlots) => {
      this.timeSlots.set(timeSlots);
    });
  }

  getSessionInstructor(id: number): string {
    const instructor = this.instructors()!.find((inst) => inst.id === id);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown Instructor';
  }

  getSessionClassType(id: number): string {
    const classType = this.classTypes()!.find((ct) => ct.id === id);
    return classType ? classType.name : 'Unknown Class Type';
  }

  openNewDialog() {
    this.isCreating.set(true);
    this.selectedSession.set({
      classTypeId: 0,
      instructorId: 0,
      timeSlotId: 0,
      price: 0,
      sessionDate: '',
      status: 'Scheduled',
    });
    this.openDialog();
  }

  saveNew() {
    const newSession = this.selectedSession();
    if (!newSession) return;

    this.sessionService.create(newSession).subscribe({
      next: () => {
        this.loadSessions();
        this.closeDialog();
        this.toastService.success('Session created successfully!');
      },
      error: (error) => {
        this.toastService.error(getErrorMessage(error, 'Failed to create class session.'), 5000);
      },
    });
  }

  openEditDialog(session: SessionResponse) {
    this.isCreating.set(false);
    this.selectedSession.set({
      ...session
    });
    this.originalSession.set(session);
    this.openDialog();
  }

  saveEdit() {
      const updatedSession = this.selectedSession();
      const original = this.originalSession();

      if (!updatedSession || !original) return;

      this.sessionService.update(original.id, updatedSession).subscribe({
        next: () => {
          this.loadSessions();
          this.closeDialog();
          this.toastService.success('Class session updated successfully!');
        },
        error: (error) => {
          this.toastService.error(getErrorMessage(error, 'Failed to update class session.'));
        },
      });
  }

  openDialog() {
    const dialog = document.getElementById('session-dialog') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeDialog() {
    const dialog = document.getElementById('session-dialog') as HTMLDialogElement;
    dialog?.close();
    this.selectedSession.set(null);
    this.originalSession.set(null);
  }

  deleteSession(id: number) {
    if (!confirm('Are you sure you want to delete this session?')) return;

    this.sessionService.delete(id).subscribe({
      next: () => {
        this.loadSessions();
        this.toastService.success('Session deleted successfully!');
      },
      error: (error) => {
        this.toastService.error('Failed to delete session: ' + (error.error?.message || error.message || 'Unknown error'));
      },
    });
  }
}
