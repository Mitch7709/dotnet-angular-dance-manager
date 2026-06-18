using Core.Models;

namespace Core.Features.Sessions.Read;

public record SessionResponse(
    int Id,
    int ClassTypeId,
    int InstructorId,
    int TimeSlotId,
    decimal Price,
    DateOnly SessionDate,
    SessionStatus Status
);
