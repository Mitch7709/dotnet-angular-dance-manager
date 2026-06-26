using System.Text.Json.Serialization;

namespace Core.Models;

public class Student : BaseEntity
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public required AppUser AppUser { get; set; }
    public string? ImageUrl { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public WaiverStatus WaiverStatus { get; set; }

    public ICollection<Booking> Bookings { get; set; } = [];

    public int CalculateAge()
    {
        if (!DateOfBirth.HasValue)
            return 0;
            
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - DateOfBirth.Value.Year;
        if (DateOfBirth.Value > today.AddYears(-age))
            age--;
        return age;
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WaiverStatus
{
    NotSigned,
    Signed,
    Expired
}
