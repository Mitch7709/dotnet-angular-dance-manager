namespace Core.Features.Users.Update;

public record UpdateUserRequest(
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly? DateOfBirth,
    string Bio
    );

public record UpdateUserResponse(
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly? DateOfBirth,
    string Bio
);
