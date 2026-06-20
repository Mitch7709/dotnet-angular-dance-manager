export type SessionRequest = {
    classTypeId: number;
    instructorId: number;
    timeSlotId: number;
    price: number;
    sessionDate: string;
    status: string; 
}

export type SessionResponse = {
    id: number;
    classTypeId: number;
    instructorId: number;
    timeSlotId: number;
    price: number;
    sessionDate: string;
    status: string; 
}