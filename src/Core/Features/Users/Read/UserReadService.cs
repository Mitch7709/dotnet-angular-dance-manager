using Core.Models;
using Core.Shared;

namespace Core.Features.Users.Read;

public class UserReadService(IUserService userService, IUserContext userContext)
{
    public async Task<Result<UserResponse>> GetByIdAsync()
    {
        var userId = userContext.GetUserId();

        if (userId is null)
        {
            return Result.Failure(ErrorType.NotFound, $"User with id {userId} not found.");
        }

        var user = await userService.FindById(userId);

        return new UserResponse(
            user!.Id,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Email,
            user.DateOfBirth ?? DateOnly.MinValue,
            user.Bio ?? string.Empty
        );
    }
}
