export type Instructor = {
     id: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}

export type UpdateInstructorDTO = {
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}