export type TimeSlotRequest = {
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