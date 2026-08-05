using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Users.Update;

public class UpdateUserUseCase(IUserService userService)
{
    public async Task<Result<UpdateUserResponse>> ExecuteAsync(string userId, UpdateUserRequest request)
    {
        var user = await userService.FindById(userId);

        if (user is null)
            return Result.Failure(ErrorType.NotFound, $"User with id {userId} was not found");

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;
        user.DateOfBirth = request.DateOfBirth;
        user.Bio = request.Bio;

        await userService.UpdateAsync(user);

        return new UpdateUserResponse(
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Email,
            user.DateOfBirth,
            user.Bio
        );
    }
}
