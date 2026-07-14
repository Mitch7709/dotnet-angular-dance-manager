using System;

namespace Core.Features.Instructors.Read;

public record InstructorResponse(
    int Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly DateOfBirth,
    string Bio,
    string ImageUrl,
    List<string> QualifiedClasses

);
