export type CreateBookingRequest = {
  sessionId: number;
  studentId: number;
}

export type BookingResponse = {
  id: number;
  bookingDate: string;
  paymentStatus: string;
  bookingStatus: string;
  priceAtBooking: number;
  confirmationId: string;
  session: BookingSessionSummary;
  student: BookingStudentSummary;
}

export type UpdateBookingRequest = {
  bookingStatus: string;
  paymentStatus: string;
}

export type UpdateBookingResponse = {
  id: number;
  sessionId: number;
  studentId: number;
  bookingDate: string;
  paymentStatus: string;
  bookingStatus: string;
  priceAtBooking: number;
  confirmationId: string;
}

export type BookingSessionSummary = {
  id: number;
  sessionDate: string;
  classTypeName: string;
}

export type BookingStudentSummary = {
  id: number;
  name: string;
}
