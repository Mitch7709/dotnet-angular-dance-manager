import { Instructor } from "./InstructorDTOs";

export type ClassTypeRequest = {
    name: string;
    description: string;
    style: string;
    level: number;
    isActive: boolean;
    qualifiedInstructors: number[]
}

export type ClassTypeResponse = {
    id: number;
    name: string;
    description: string;
    style: string;
    level: number;
    isActive: boolean;
    qualifiedInstructors: number[];
    instructors: Instructor[];
}