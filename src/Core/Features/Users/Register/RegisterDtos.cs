using System;
using Core.Models;
using Microsoft.AspNetCore.Http;

namespace Core.Features.Users.Register;

public record RegisterStudentRequest(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string? Bio,
    string Password
    );

    public record RegisterInstructorRequest(
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string? Bio,
        string DateOfBirth,
        string Password
    );

public record RegisterResponse(
    string UserId,
    string Token
);
