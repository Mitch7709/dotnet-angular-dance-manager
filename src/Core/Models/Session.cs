using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Models;

public class Session : BaseEntity
{
    public int Id { get; set; }
    public int ClassTypeId { get; set; }
    public ClassType ClassType { get; set; } = null!;
    public int InstructorId { get; set; }
    public Instructor Instructor { get; set; } = null!;
    public int TimeSlotId { get; set; }
    public TimeSlot TimeSlot { get; set; } = null!;
    public decimal Price { get; set; }
    public DateOnly SessionDate { get; set; }
    public SessionStatus Status { get; set; }
    public int TotalSeats { get; set; }

    public ICollection<Booking> Bookings { get; set; } = [];

    public int GetAvailableSeats()
    {
        return TotalSeats - Bookings.Count;
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SessionStatus
{
    Scheduled,
    Completed,
    Cancelled
}
