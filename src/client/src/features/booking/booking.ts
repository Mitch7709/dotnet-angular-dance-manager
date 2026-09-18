import { Component, ViewChild, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FullCalendarModule, FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import { SessionService } from '../../core/services/session-service';
import { BookingService } from '../../core/services/booking-service';

interface Session {
  id: string;
  classType: string;
  instructor: string;
  dateTime: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM:SS
  duration: number; // minutes
  price: number;
  availableSpots: number;
  totalSeats: number;
}

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

  protected selectedSession: Session | null = null;
  protected sessions: Session[] = [];

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

  private transformApiSessionsToLocalFormat(apiSessions: any[]): Session[] {
    return apiSessions.map((apiSession) => ({
      id: apiSession.id.toString(),
      classType: apiSession.classTypeName,
      instructor: apiSession.instructorName,
      dateTime: `${apiSession.dayOfWeek} ${this.formatTime(apiSession.startTime)}`,
      sessionDate: apiSession.sessionDate, // YYYY-MM-DD
      startTime: apiSession.startTime, // HH:MM:SS
      duration: apiSession.duration,
      price: apiSession.price,
      availableSpots: 0, // TODO: Add availability tracking to backend
      totalSeats: apiSession.totalSeats, // TODO: Add capacity tracking to backend
    }));
  }

  private formatTime(timeString: string): string {
    // Convert from 24-hour format (HH:MM:SS or HH:MM) to 12-hour format (h:MM AM/PM)
    if (!timeString) return '00:00 AM';

    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];

    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  }
  private mapSessionsToCalendarEvents(sessions: Session[]): void {
    const events = sessions.map((session) => {
      const startDateTime = this.buildDateTime(session.sessionDate, session.startTime);
      const endDateTime = this.calculateEndDateTime(startDateTime, session.duration);

      return {
        id: session.id,
        title: `${session.classType} - ${session.instructor}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: session.availableSpots > 0 ? '#3788d8' : '#d4d4d8',
        borderColor: session.availableSpots > 0 ? '#0066cc' : '#a0a0a0',
        textColor: '#000000',
        extendedProps: {
          classType: session.classType,
          instructor: session.instructor,
          price: session.price,
          availableSpots: session.availableSpots,
          totalSeats: session.totalSeats,
          sessionId: session.id,
        },
      };
    });

    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      events.forEach((event) => {
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

    if (session) {
      this.selectedSession = session;
      this.cdr.detectChanges();
      console.log('Selected session:', this.selectedSession);
      this.openSessionDialog();
    }
  }

  protected bookSession(): void {
    if (!this.selectedSession) return;

    // if (this.selectedSession.availableSpots === 0) {
    //   alert('This session is fully booked!');
    //   return;
    // }

    // TODO: Connect to backend to book the session
    // console.log('Booking session:', this.selectedSession);

    this.bookingService.bookForUser(Number(this.selectedSession.id)).subscribe({
      next: () => {
        alert(`Successfully booked: ${this.selectedSession!.classType}`);
      },
      error: (err) => {
        console.error('Failed to book session:', err);
        alert('Failed to book session. Please try again.');
      },
    });

    alert(`Successfully booked: ${this.selectedSession!.classType}`);

    // Close the modal
    this.closeSessionDialog();

    this.selectedSession = null;
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
