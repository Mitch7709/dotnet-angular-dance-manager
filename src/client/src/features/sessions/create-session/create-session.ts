import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import { TimeslotService } from '../../../core/services/timeslot-service';
import { TimeSlotResponse } from '../../../types/DTOs/TimeSlotDTOs';

@Component({
  selector: 'app-create-session',
  imports: [FullCalendarModule],
  templateUrl: './create-session.html',
  styleUrl: './create-session.css',
})
export class CreateSession implements OnInit {
  @ViewChild(FullCalendarComponent) calendarComponent?: FullCalendarComponent;

  private readonly timeslotService = inject(TimeslotService);
  protected timeSlots: TimeSlotResponse[] = [];

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
      daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
      startTime: '09:00', // 9am
      endTime: '17:00', // 5pm
    },
    events: [

    ],
  };

  ngOnInit(): void {
    // Initialization logic here

    // const dummyEvents = [
    //   { title: 'Available Slot', daysOfWeek: [1], startTime: '12:00:00', endTime: '12:49:00', color: '#3788d8' },
    //   { title: 'Available Slot', daysOfWeek: [2], startTime: '14:00:00', endTime: '15:00:00', color: '#3788d8' },
    // ];

    // this.calendarOptions.events = dummyEvents;

    this.timeslotService.getAll().subscribe({
      next: (slots) => {
        this.timeSlots = slots;
        const mappedEvents = this.mapTimeSlotsToEvents(slots);
        // this.calendarOptions.events = this.mapTimeSlotsToEvents(slots);
        console.log(mappedEvents);

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
