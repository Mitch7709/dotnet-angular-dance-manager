using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.TimeSlots.Delete;

public class DeleteTimeSlotUseCase(IDbContext dbContext)
{
    public async Task<Result> ExecuteAsync(int id)
    {
        var timeSlot = await dbContext.Set<TimeSlot>().FindAsync(id);
        if (timeSlot is null)
        {
            return Result.Failure(ErrorType.NotFound, $"TimeSlot with id {id} not found.");
        }

        var linkedSessions = await dbContext.Set<Session>()
            .Where(s => s.TimeSlotId == id)
            .AnyAsync();

        if (linkedSessions)
        {
            return Result.Failure(ErrorType.Conflict, $"Cannot delete TimeSlot with id {id} because it is linked to existing sessions.");
        }

        dbContext.Set<TimeSlot>().Remove(timeSlot);
        await dbContext.SaveChangesAsync();

        return Result.Success();
    }
}
