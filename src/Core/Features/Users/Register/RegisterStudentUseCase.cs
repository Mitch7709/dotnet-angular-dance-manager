using Core.Models;
using Core.Features.Students.Create;
using Core.Features.Instructors.Create;

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

        var user = new AppUser
        (
            request.Email,
            request.FirstName,
            request.LastName,
            request.PhoneNumber
        );

        var result = await userService.Register(user, request.Password, UserRole.Student);
        if (result.IsFailure)
        {
            return Result.Failure(result.ErrorType.Value, result.ErrorMessage);
        }

        var dateOfBirth = DateOnly.ParseExact(request.DateOfBirth, "yyyy-MM-dd", null);

        var studentRequest = new CreateStudentRequest(user.Id, dateOfBirth);
        await createStudentUseCase.ExecuteAsync(studentRequest);

        var token = await tokenService.GenerateToken(user);

        return new RegisterResponse(user.Id, token);
    }
}
