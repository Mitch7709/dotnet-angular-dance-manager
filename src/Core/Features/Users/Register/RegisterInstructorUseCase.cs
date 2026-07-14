using System;
using System.Collections.Generic;
using System.Text;
using Core.Features.Instructors.Create;
using Core.Models;

namespace Core.Features.Users.Register
{
    public class RegisterInstructorUseCase
    (
        IUserService userService,
        ITokenService tokenService,
        CreateInstructorUseCase createInstructorUseCase
    )
    {
        public async Task<Result<RegisterResponse>> Execute(RegisterInstructorRequest request)
        {
            var existingUser = await userService.FindByEmail(request.Email);
            if (existingUser != null)
            {
                return Result.Failure(ErrorType.ValidationError, "User already exists with this email.");
            }

            if (request.Bio is null)
            {
                return Result.Failure(ErrorType.ValidationError, "A bio is required for instructors.");
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
            var result = await userService.Register(user, request.Password, UserRole.Instructor);
            if (result.IsFailure)
            {
                return Result.Failure(result.ErrorType.Value, result.ErrorMessage);
            }

            var instructorRequest = new CreateInstructorRequest(user.Id, request.Bio);
            await createInstructorUseCase.ExecuteAsync(instructorRequest);

            var token = await tokenService.GenerateToken(user);

            return new RegisterResponse(
                user.Id,
                token
            );
        }
    }
}
