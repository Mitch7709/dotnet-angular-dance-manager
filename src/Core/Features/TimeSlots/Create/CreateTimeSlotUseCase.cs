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
                && ts.StartTime == request.StartTime);

        if (exists)
        {
            return Result.Failure(ErrorType.Conflict, "A time slot already exists with the same day and start time.");
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
