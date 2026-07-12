using Core.Features.Instructors.Read;
using Core.Features.Students.Read;
using Core.Models;

namespace Core.Features.Users.Login;

public class LoginUseCase(IUserService userService,
                            ITokenService tokenService,
                            StudentReadService studentReadService,
                            InstructorReadService instructorReadService)
{
    public async Task<Result<LoginResponse>> Execute(LoginRequest request)
    {
        var user = await userService.Login(request.Email, request.Password);
        if (user == null)
            return Result.Failure(ErrorType.ValidationError, "Invalid email or password");

        var token = await tokenService.GenerateToken(user);
        var role = await userService.GetRole(user);

        var response = new LoginResponse
        {
            Token = token,
            Email = user.Email,
            DisplayName = $"{user.FirstName} {user.LastName}",
            PhoneNumber = user.PhoneNumber,
        };

        if (role == "Student")
        {
            var student = await studentReadService.GetByUserIdAsync(user.Id);
            if (student.IsSuccess)
            {
                response.DateOfBirth = student.Value.DateOfBirth;
                response.WaiverStatus = student.Value.WaiverStatus;
            }
        }
        else if (role == "Instructor" || role == "Admin")
        {
            var instructor = await instructorReadService.GetByUserIdAsync(user.Id);
            if (instructor.IsSuccess)
            {
                response.Bio = instructor.Value.Bio;
                response.QualifiedClasses = instructor.Value.QualifiedClasses;
            }
        }

        return response;
    }
}
