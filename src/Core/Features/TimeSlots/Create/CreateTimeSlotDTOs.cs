
namespace Core.Features.TimeSlots.Create;

public record CreateTimeSlotRequest(
    TimeOnly StartTime,
    int DurationInMinutes,
    string DayOfWeek
    );

public record CreateTimeSlotResponse(
    int Id,
    TimeOnly StartTime,
    int DurationInMinutes,
    DayOfWeek DayOfWeek,
    bool IsActive
);
