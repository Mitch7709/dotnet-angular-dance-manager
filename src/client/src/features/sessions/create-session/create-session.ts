import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import { TimeslotService } from '../../../core/services/timeslot-service';
import { ClasstypeService } from '../../../core/services/classtype-service';
import { TimeSlotResponse } from '../../../types/DTOs/TimeSlotDTOs';
import { ClassTypeResponse } from '../../../types/DTOs/ClassTypeDTOs';
import { InstructorService } from '../../../core/services/instructor-service';
import { UserService } from '../../../core/services/user-service';
import { SessionService } from '../../../core/services/session-service';
import { SessionRequest } from '../../../types/DTOs/SessionDTOs';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-create-session',
  imports: [FullCalendarModule, ReactiveFormsModule],
  templateUrl: './create-session.html',
  styleUrl: './create-session.css',
})
export class CreateSession implements OnInit {
  @ViewChild(FullCalendarComponent) calendarComponent?: FullCalendarComponent;

  private toastService = inject(ToastService);

  private fb = inject(FormBuilder);
  protected sessionForm: FormGroup;

  private readonly sessionService = inject(SessionService);
  private readonly timeslotService = inject(TimeslotService);
  private readonly classtypeService = inject(ClasstypeService);
  private readonly instructorService = inject(InstructorService);
  private readonly userService = inject(UserService);

  protected classTypes: ClassTypeResponse[] = [];
  protected timeSlots: TimeSlotResponse[] = [];

  constructor() {
    this.sessionForm = this.fb.group({
      classType: [''],
      timeSlot: [''],
      price: [0.0],
      date: [''],
      instructorId: [0],
      status: ['Scheduled'],
      totalSeats: [0],
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, themePlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
    },
    editable: true,
    selectable: true,
    allDaySlot: false,
    selectConstraint: 'businessHours',
    slotMinTime: '09:00:00',
    slotMaxTime: '17:00:00',
    height: 'auto',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '09:00',
      endTime: '17:00',
    },
    eventClick: (info) => {
      // console.log('Event clicked:', info.event);

      var slotDetails = info.event.extendedProps;
      // console.log('Slot details:', slotDetails);

      this.sessionForm.patchValue({
        classType: this.classTypes.length > 0 ? this.classTypes[0].id : '',
        timeSlot: slotDetails['slotId'],
        price: 0.0,
        date: info.event.start?.toISOString().split('T')[0],
        status: 'Scheduled',
      });
      // console.log('Dialog options:', this.sessionForm.value);
      const sessionDialog = document.getElementById('sessionDialog') as HTMLDialogElement;
      if (sessionDialog) {
        sessionDialog.showModal();
      }
    },
  };

  ngOnInit(): void {
    this.getInstructorId();

    this.timeslotService.getAll().subscribe({
      next: (slots) => {
        this.timeSlots = slots;
        const mappedEvents = this.mapTimeSlotsToEvents(slots);

        if (this.calendarComponent) {
          const calendarApi = this.calendarComponent.getApi();
          mappedEvents.forEach((event) => {
            calendarApi.addEvent(event);
          });
        } else {
          this.calendarOptions = {
            ...this.calendarOptions,
            events: mappedEvents,
          };
        }
      },
    });

    this.classtypeService.getAll().subscribe({
      next: (classTypes) => {
        this.classTypes = classTypes;
      },
    });
  }

  createSession() {
    if (this.sessionForm.valid) {
      const sessionData = this.sessionForm.value;

      var sessionRequest: SessionRequest = {
        classTypeId: sessionData.classType,
        timeSlotId: sessionData.timeSlot,
        price: sessionData.price,
        sessionDate: sessionData.date,
        status: sessionData.status,
        instructorId: sessionData.instructorId,
        totalSeats: sessionData.totalSeats,
      };
      // console.log('Session request:', sessionRequest);

      this.sessionService.create(sessionRequest).subscribe({
        next: (response) => {
          // console.log('Session created successfully:', response);
          this.toastService.success('Session created successfully');

          const sessionDialog = document.getElementById('sessionDialog') as HTMLDialogElement;
          if (sessionDialog) {
            sessionDialog.close();
          }
        },
        error: (error) => {
          // console.error('Error creating session:', error);
          this.toastService.error('Error creating session');
        },
      });
    }
  }

  private getInstructorId() {
    var currentUser = this.userService.currentUser();
    console.log('Current user:', currentUser);
    if (currentUser) {
      this.instructorService.getByUserId(currentUser.userId).subscribe({
        next: (response) => {
          this.sessionForm.patchValue({
            instructorId: response.id,
          });
          console.log('Updated instructor ID:', this.sessionForm.value.instructorId);
        },
      });
    }
  }

  private mapTimeSlotsToEvents(slots: TimeSlotResponse[]) {
    return slots.map((slot) => ({
      title: `Available Slot`,
      daysOfWeek: [this.getDayIndex(slot.dayOfWeek)],
      startTime: slot.startTime,
      endTime: this.calculateEndTime(slot.startTime, slot.durationInMinutes),
      color: '#3788d8',
      extendedProps: {
        slotId: slot.id,
        duration: slot.durationInMinutes,
      },
    }));
  }

  private getDayIndex(dayName: string): number {
    const days: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return days[dayName] ?? 0;
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;
  }
}
