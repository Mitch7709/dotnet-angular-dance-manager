using System.Security.Claims;
using Core.Features.Users;
using Core.Models;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity;

public class UserService(UserManager<AppUser> userManager) : IUserService
{
    public Task<AppUser?> FindByEmail(string email)
    {
        return userManager.FindByEmailAsync(email);
    }

    public async Task<AppUser?> Login(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return null;
        }

        var passwordMatch = await userManager.CheckPasswordAsync(user, password);

        return passwordMatch ? user : null;
    }

    public async Task<Result<string>> Register(AppUser user, string password, UserRole role)
    {
        var result = await userManager.CreateAsync(user, password);

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, role.ToString());
            return Result<string>.Success(user.Id);
        }

        return Result.Failure(ErrorType.DataError, result.Errors.FirstOrDefault()?.Description ?? "User creation failed");
    }

    public async Task<string> GetRole(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);
        return roles.FirstOrDefault() ?? string.Empty;
    }
}
