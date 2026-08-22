export type InstructorResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  bio: string;
  imageUrl?: any;
  qualifiedClasses: string[];
};

export type UpdateInstructorRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  qualifiedClasses: string[];
};

export type UpdateInstructorResponse = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  imageUrl: any;
  qualifiedClasses: string[];
};
