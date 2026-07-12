using Core.Features.Instructors.Read;
using Core.Features.Students.Read;
using Core.Models;

namespace Core.Features.Users.Login
{
    public record LoginRequest(string Email, string Password);
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;

        // Student-specific properties
        public DateOnly DateOfBirth { get; set; }
        public WaiverStatus WaiverStatus { get; set; }

        // Instructor-specific properties
        public string Bio { get; set; } = string.Empty;
        public List<string> QualifiedClasses { get; set; } = [];
    }
}
