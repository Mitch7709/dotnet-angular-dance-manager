using Core.Models;
using System;

namespace Core.Features.Instructors.Create;

public record CreateInstructorRequest(
    string AppUserId,
    string? Bio
    );

public record CreateInstructorResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber
);
