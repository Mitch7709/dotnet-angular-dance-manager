using System;

namespace Core.Features.Students.Create;

public record CreateStudentRequest(
    string AppUserId,
    DateOnly? DateOfBirth
    );

public record CreateStudentResponse(
    int Id,
    string FirstName,
    string LastName,
    DateOnly? DateOfBirth,
    string Email,
    string PhoneNumber
);
