using Core.Features.Instructors.Create;
using Core.Features.Students.Create;
using Core.Models;

namespace Core.Features.Users.Register;

public class RegisterStudentUseCase(
    IUserService userService,
    ITokenService tokenService,
    CreateStudentUseCase createStudentUseCase
    )
{
    public async Task<Result<RegisterResponse>> Execute(RegisterStudentRequest request)
    {
        var existingUser = await userService.FindByEmail(request.Email);
        if (existingUser != null)
        {
            return Result.Failure(ErrorType.ValidationError, "User already exists with this email.");
        }

        DateOnly? dateOfBirth = DateOnly.TryParse(request.DateOfBirth, out var dob) ? dob : null;

        var user = new AppUser
        (
            request.Email,
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            dateOfBirth,
            request.Bio
        );

        var result = await userService.Register(user, request.Password, UserRole.Student);
        if (result.IsFailure)
        {
            return Result.Failure(result.ErrorType.Value, result.ErrorMessage);
        }

        var studentRequest = new CreateStudentRequest(user.Id);
        await createStudentUseCase.ExecuteAsync(studentRequest);

        var token = await tokenService.GenerateToken(user);

        return new RegisterResponse(
            user.Id,
            token
        );
    }
}
