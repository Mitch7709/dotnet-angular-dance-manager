using Core.Models;

namespace Core.Features.Sessions.Update;

public record UpdateSessionRequest(
    int ClassTypeId,
    int InstructorId,
    int TimeSlotId,
    decimal Price,
    DateOnly SessionDate,
    string Status,
    int TotalSeats

);

public record UpdateSessionResponse(
    int Id,
    int ClassTypeId,
    int InstructorId,
    int TimeSlotId,
    decimal Price,
    DateOnly SessionDate,
    SessionStatus Status,
    int TotalSeats
);
