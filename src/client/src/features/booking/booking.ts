import { Component, ViewChild, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FullCalendarModule, FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import { SessionService } from '../../core/services/session-service';
import { BookingService } from '../../core/services/booking-service';
import { SessionResponse } from '../../types/DTOs/SessionDTOs';
import { BookingResponse } from '../../types/DTOs/BookingDTOs';

@Component({
  selector: 'app-booking',
  imports: [FullCalendarModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  @ViewChild(FullCalendarComponent) calendarComponent?: FullCalendarComponent;

  private readonly sessionService = inject(SessionService);
  private readonly bookingService = inject(BookingService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected selectedSession: SessionResponse | null = null;
  protected sessions: SessionResponse[] = [];
  protected studentSessions: BookingResponse[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, themePlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    height: 'auto',
    slotMinTime: '09:00:00',
    slotMaxTime: '17:00:00',
    allDaySlot: false,
    slotDuration: '00:30:00',
    eventClick: (info) => this.handleEventClick(info),
    selectable: false,
    editable: false,
  };

  ngOnInit(): void {
    this.loadStudentSessions();
    this.loadUpcomingSessions();
  }

  private loadUpcomingSessions(): void {
    this.sessionService.getUpcoming().subscribe({
      next: (apiSessions) => {
        // console.log('API sessions:', apiSessions);
        const transformedSessions = this.transformApiSessionsToLocalFormat(apiSessions);
        // console.log(transformedSessions);
        this.sessions = transformedSessions;
        this.mapSessionsToCalendarEvents(transformedSessions);
      },
      error: (error) => {
        console.error('Error loading upcoming sessions:', error);
      },
    });
  }

  private loadStudentSessions(): void {
    this.bookingService.getForStudent().subscribe({
      next: (response) => {
        this.studentSessions = response;
      }
    })
  }

  protected bookSession(): void {
    if (!this.selectedSession) return;

    this.bookingService.bookForUser(Number(this.selectedSession.id)).subscribe({
      next: () => {
        alert(`Successfully booked: ${this.selectedSession!.classTypeName}`);
        this.selectedSession!.availableSeats--;
      },
      error: (err) => {
        console.error('Failed to book session:', err);
        alert('Failed to book session. Please try again.');
      },
    });

    alert(`Successfully booked: ${this.selectedSession!.classTypeName}`);

    // Close the modal
    this.closeSessionDialog();
    this.selectedSession = null;
  }

  private transformApiSessionsToLocalFormat(apiSessions: any[]): SessionResponse[] {
    return apiSessions.map((apiSession) => ({
      id: apiSession.id,
      classTypeId: apiSession.classTypeId,
      classTypeName: apiSession.classTypeName,
      instructorId: apiSession.instructorId,
      instructorName: apiSession.instructorName,
      timeSlotId: apiSession.timeSlotId,
      startTime: apiSession.startTime,
      duration: apiSession.duration,
      dayOfWeek: apiSession.dayOfWeek,
      price: apiSession.price,
      sessionDate: apiSession.sessionDate,
      status: apiSession.status,
      totalSeats: apiSession.totalSeats,
      availableSeats: apiSession.availableSeats,
    }));
  }

  private mapSessionsToCalendarEvents(sessions: SessionResponse[]): void {
    const events = sessions.map((session) => {
      const startDateTime = this.buildDateTime(session.sessionDate, session.startTime);
      const endDateTime = this.calculateEndDateTime(startDateTime, session.duration);

      return {
        id: session.id.toString(),
        title: `${session.classTypeName} - ${session.instructorName}`,
        start: startDateTime,
        end: endDateTime,
        color: session.availableSeats > 0 ? '#3788d8' : '#d4d4d8',
        // borderColor: session.availableSeats > 0 ? '#0066cc' : '#a0a0a0',
        textColor: '#000000',
        extendedProps: {
          classType: session.classTypeName,
          instructor: session.instructorName,
          price: session.price,
          availableSpots: session.availableSeats,
          totalSeats: session.totalSeats,
          sessionId: session.id,
        },
      };
    });

    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      events.forEach((event) => {
        console.log('Adding event to calendar:', event);
        calendarApi.addEvent(event);
      });
    } else {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: events,
      };
    }
  }

  private buildDateTime(dateString: string, timeString: string): string {
    // Combine date (YYYY-MM-DD) and time (HH:MM:SS) into ISO datetime string
    return `${dateString}T${timeString}`;
  }

  private calculateEndDateTime(startDateTime: string, durationMinutes: number): string {
    // Parse start datetime and add duration
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return endDate.toISOString();
  }

  private handleEventClick(info: any): void {
    const extendedProps = info.event.extendedProps;
    const sessionId = extendedProps.sessionId;
    const session = this.sessions.find((s) => s.id === sessionId);

    if (session && extendedProps.availableSpots > 0) {
      if (this.isSessionAlreadyBooked(sessionId)) {
        alert('You have already booked this session.');
        return;
      }

      this.selectedSession = session;
      this.cdr.detectChanges();
      this.openSessionDialog();
    }
  }

  private isSessionAlreadyBooked(sessionId: number): boolean {
    return this.studentSessions.some(s => s.session.id === sessionId);
  }

  protected openSessionDialog(): void {
    const dialog = document.getElementById('sessionDetailsDialog') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  }

  protected closeSessionDialog(): void {
    const dialog = document.getElementById('sessionDetailsDialog') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  }
}
