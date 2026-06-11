export type Instructor = {
     id: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}

export type UpdateInstructorRequest = {
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}

export type UpdateInstructorResponse = {
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}