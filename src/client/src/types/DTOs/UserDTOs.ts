
export type LoginCreds = {
  email: string;
  password: string;
};

export type RegisterStudentCreds = {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    bio?: string;
    phoneNumber: string;
    password: string;
};

export type RegisterInstructorCreds = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    bio: string;
};

export type AuthResponse = {
    userId: string;
    token: string;
}

export type User = {
    userId: string;
    email: string;
    displayName: string;
    roles: AppRole[];
    imageUrl?: string;
}

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  bio?: string;
  studentUser?: StudentUser;
  instructorUser?: InstructorUser;
}

export type StudentUser = {
  waiverStatus: string;
}

export type InstructorUser = {
  bio: string;
  qualifiedClasses: string[];
}

export type AppRole = 'Student' | 'Instructor' | 'Admin';
