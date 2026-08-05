using System;
using System.Collections.Generic;
using System.Text;
using Core.Models;

namespace Core.Features.Users;

public interface IUserService
{
    Task<AppUser?> FindByEmail(string email);
    Task<Result<string>> Register(AppUser user, string password, UserRole role);
    Task<AppUser?> Login(string email, string password);
    Task<string> GetRole(AppUser user);
    Task<AppUser?> FindById(string userId);
    Task UpdateAsync(AppUser user);
}
