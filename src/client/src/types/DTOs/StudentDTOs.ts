export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
};

export type UpdateStudentRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  imageUrl: any;
  waiverStatus: string;
};

export type UpdateStudentResponse = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  imageUrl: any;
  waiverStatus: string;
};
