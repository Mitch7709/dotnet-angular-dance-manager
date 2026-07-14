using System;
using Core.Models;

namespace Core.Features.Students.Read;

public record StudentResponse (
    int Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly DateOfBirth,
    string Bio,
    WaiverStatus WaiverStatus,
    string? ImageUrl
);
