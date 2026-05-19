using Core.Models;
using System;

namespace Core.Features.Users.Register;

public record RegisterStudentRequest(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string? ImageUrl,
    string Password
    );

    public record RegisterInstructorRequest(
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string? Bio,
        string? ImageUrl,
        string Password
    );

public record RegisterResponse(
    string UserId,
    string Token
);
