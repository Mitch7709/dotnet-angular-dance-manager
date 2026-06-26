using Core.Models;
using Microsoft.AspNetCore.Http;
using System;

namespace Core.Features.Users.Register;

public record RegisterStudentRequest(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string Password
    );

    public record RegisterInstructorRequest(
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string? Bio,
        string Password
    );

public record RegisterResponse(
    string UserId,
    string Token
);
