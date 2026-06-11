export type ClassTypeRequest = {
    name: string;
    description: string;
    style: string;
    level: number;
    isActive: boolean;
    qualifiedInstructorIds: number[]
}

export type ClassTypeResponse = {
    id: number;
    name: string;
    description: string;
    style: string;
    level: number;
    isActive: boolean;
    qualifiedInstructorIds: number[];
}
