export type CreateTimeSlotRequest = {
    startTime: string;
    durationInMinutes: number;
    dayOfWeek: string;    
}

export type UpdateTimeSlotRequest = {
    startTime: string;
    durationInMinutes: number;
    dayOfWeek: string;    
    isActive: boolean;
}

export type TimeSlotResponse = {
    id: number;
    startTime: string;
    durationInMinutes: number;
    dayOfWeek: string;    
    isActive: boolean;
}