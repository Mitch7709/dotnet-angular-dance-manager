using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.TimeSlots.Read;

public class TimeSlotReadService(IDbContext dbContext)
{
    public async Task<IReadOnlyList<TimeSlotResponse>> GetAllAsync()
    {
        return await dbContext.Set<TimeSlot>()
        .AsNoTracking()
            .Select(ts => new TimeSlotResponse
            (
                ts.Id,
                ts.StartTime,
                ts.DurationInMinutes,
                ts.DayOfWeek,
                ts.IsActive
            ))
            .ToListAsync();
    }

    public async Task<IReadOnlyList<TimeSlotResponse>> GetActiveAsync()
    {
        return await dbContext.Set<TimeSlot>()
        .AsNoTracking()
            .Where(ts => ts.IsActive)
            .Select(ts => new TimeSlotResponse
            (
                ts.Id,
                ts.StartTime,
                ts.DurationInMinutes,
                ts.DayOfWeek,
                ts.IsActive
            ))
            .ToListAsync();
    }

    public async Task<Result<TimeSlotResponse>> GetByIdAsync(int id)
    {
        var timeSlot = await dbContext.Set<TimeSlot>()
        .AsNoTracking()
            .Where(ts => ts.Id == id)
            .Select(ts => new TimeSlotResponse
            (
                ts.Id,
                ts.StartTime,
                ts.DurationInMinutes,
                ts.DayOfWeek,
                ts.IsActive
            ))
            .FirstOrDefaultAsync();

        if (timeSlot is null)
        {
            return Result.Failure(ErrorType.NotFound, $"TimeSlot with id {id} not found.");
        }

        return timeSlot;
    }
}
