export type StudentResponse = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  bio: string;
  imageUrl?: any;
  waiverStatus: string;
};

export type UpdateStudentRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  bio: string;
  waiverStatus: string;
};

export type UpdateStudentResponse = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  bio: string;
  waiverStatus: string;
};
