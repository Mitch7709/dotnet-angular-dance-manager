using System;
using Core.Models;

namespace Core.Features.Students.Update;

public record UpdateStudentRequest(
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly? DateOfBirth,
    string Bio,
    string WaiverStatus
);

public record UpdateStudentResponse(
    int Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly? DateOfBirth,
    string Bio,
    WaiverStatus WaiverStatus
);
