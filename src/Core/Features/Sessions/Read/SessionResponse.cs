using Core.Models;

namespace Core.Features.Sessions.Read;

public record SessionResponse(
    int Id,
    int ClassTypeId,
    string ClassTypeName,
    int InstructorId,
    string InstructorName,
    int TimeSlotId,
    TimeOnly StartTime,
    int Duration,
    string DayOfWeek,
    decimal Price,
    DateOnly SessionDate,
    SessionStatus Status,
    int TotalSeats,
    int AvailableSeats
);
