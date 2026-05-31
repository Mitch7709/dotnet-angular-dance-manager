using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.TimeSlots.Create;

public class CreateTimeSlotUseCase(IDbContext dbContext)
{
    public async Task<Result<CreateTimeSlotResponse>> ExecuteAsync(CreateTimeSlotRequest request)
    {
        var dayOfWeekParsed = Enum.Parse<DayOfWeek>(request.DayOfWeek, ignoreCase: true);

        var exists = await dbContext.Set<TimeSlot>()
            .AnyAsync(ts => ts.DayOfWeek == dayOfWeekParsed
                && ts.StartTime == request.StartTime
                && ts.DurationInMinutes == request.DurationInMinutes);

        if (exists)
        {
            return Result.Failure(ErrorType.Conflict, "A time slot with the same day, start time, and duration already exists.");
        }

        var timeSlot = new TimeSlot
        {
            StartTime = request.StartTime,
            DurationInMinutes = request.DurationInMinutes,
            DayOfWeek = dayOfWeekParsed,
            IsActive = true
        };

        dbContext.Set<TimeSlot>().Add(timeSlot);
        await dbContext.SaveChangesAsync();

        return new CreateTimeSlotResponse(
            timeSlot.Id,
            timeSlot.StartTime,
            timeSlot.DurationInMinutes,
            timeSlot.DayOfWeek,
            timeSlot.IsActive
        );
    }
}
