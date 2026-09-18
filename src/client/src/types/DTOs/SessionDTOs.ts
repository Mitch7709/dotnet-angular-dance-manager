export type SessionRequest = {
    classTypeId: number;
    instructorId: number;
    timeSlotId: number;
    price: number;
    sessionDate: string;
    status: string;
    totalSeats: number;
}

export type SessionResponse = {
    id: number;
    classTypeId: number;
    classTypeName: string;
    instructorId: number;
    instructorName: string;
    timeSlotId: number;
    startTime: string;
    duration: number;
    dayOfWeek: string;
    price: number;
    sessionDate: string;
    status: string;
    totalSeats: number;
}
