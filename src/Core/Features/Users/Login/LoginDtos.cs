using Core.Features.Instructors.Read;
using Core.Features.Students.Read;
using Core.Models;

namespace Core.Features.Users.Login
{
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string UserId, string Token);
}
