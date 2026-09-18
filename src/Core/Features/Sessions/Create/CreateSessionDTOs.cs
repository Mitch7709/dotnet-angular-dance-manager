using Core.Models;

namespace Core.Features.Sessions.Create;

public record CreateSessionRequest(
    int ClassTypeId,
    int InstructorId,
    int TimeSlotId,
    decimal Price,
    DateOnly SessionDate,
    SessionStatus Status,
    int TotalSeats

);

public record CreateSessionResponse(
    int Id,
    int ClassTypeId,
    int InstructorId,
    int TimeSlotId,
    decimal Price,
    DateOnly SessionDate,
    SessionStatus Status,
    int TotalSeats
);
