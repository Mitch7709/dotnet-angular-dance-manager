export type Instructor = {
     id: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}

export type InstructorResponse = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  imageUrl: any;
  qualifiedClasses: string[];
}

export type UpdateInstructorDTO = {
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     bio: string;
}
