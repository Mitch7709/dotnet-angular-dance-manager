using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models;

public class Booking : BaseEntity
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public Session Session { get; set; } = null!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public DateTime BookingDate { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public string ConfirmationId { get; set; } = string.Empty;
    public decimal PriceAtBooking { get; set; }
    public BookingStatus BookingStatus { get; set; }

    public string GenerateConfirmationId() {
        return Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
    }
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Cancelled
}

public enum BookingStatus
{
    Active,
    Cancelled,
    Completed
}
