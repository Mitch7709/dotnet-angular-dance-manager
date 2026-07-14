using System;

namespace Core.Features.Students.Create;

public record CreateStudentRequest(
    string AppUserId
);

public record CreateStudentResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber
);
