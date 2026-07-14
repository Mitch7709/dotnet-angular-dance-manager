using System.Text.Json.Serialization;

namespace Core.Models;

public class Student : BaseEntity
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public required AppUser AppUser { get; set; }
    public WaiverStatus WaiverStatus { get; set; }

    public ICollection<Booking> Bookings { get; set; } = [];
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WaiverStatus
{
    NotSigned,
    Signed,
    Expired
}
