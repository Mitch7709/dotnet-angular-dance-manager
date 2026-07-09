
export type LoginCreds = {
  email: string;
  password: string;
};

export type RegisterStudentCreds = {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
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
    email: string;
    displayName: string;
    roles: AppRole[];
    imageUrl?: string;
}

export type AppRole = 'Student' | 'Instructor' | 'Admin';
