export type SessionRequest = {
    classTypeId: number;
    instructorId: number;
    timeslotId: number;
    price: number;
    sessionDate: string;
    sessionStatus: string; 
}

export type SessionResponse = {
    id: number;
    classTypeId: number;
    instructorId: number;
    timeslotId: number;
    price: number;
    sessionDate: string;
    sessionStatus: string; 
}