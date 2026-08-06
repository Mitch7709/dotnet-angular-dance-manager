namespace Core.Features.Users.Read;

public record UserResponse(
    string Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    DateOnly DateOfBirth,
    string Bio
);
