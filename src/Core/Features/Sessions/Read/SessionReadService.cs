using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Sessions.Read;

public class SessionReadService(IDbContext dbContext)
{
    public async Task<IReadOnlyList<SessionResponse>> GetAllAsync(int page, int pageSize)
    {
        if (page == 0)
            page = 1;

        if (pageSize == 0)
            pageSize = 10;

        return await dbContext.Set<Session>()
            .AsNoTracking()
            .OrderBy(s => s.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new SessionResponse(
                s.Id,
                s.ClassTypeId,
                s.ClassType.Name,
                s.InstructorId,
                $"{s.Instructor.AppUser.FirstName} {s.Instructor.AppUser.LastName}",
                s.TimeSlotId,
                s.TimeSlot.StartTime,
                s.TimeSlot.DurationInMinutes,
                s.TimeSlot.DayOfWeek.ToString(),
                s.Price,
                s.SessionDate,
                s.Status,
                s.TotalSeats
            ))
            .ToListAsync();
    }

    public async Task<Result<SessionResponse>> GetByIdAsync(int id)
    {
        var session = await dbContext.Set<Session>()
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new SessionResponse(
                s.Id,
                s.ClassTypeId,
                s.ClassType.Name,
                s.InstructorId,
                $"{s.Instructor.AppUser.FirstName} {s.Instructor.AppUser.LastName}",
                s.TimeSlotId,
                s.TimeSlot.StartTime,
                s.TimeSlot.DurationInMinutes,
                s.TimeSlot.DayOfWeek.ToString(),
                s.Price,
                s.SessionDate,
                s.Status,
                s.TotalSeats
            ))
            .FirstOrDefaultAsync();

        if (session is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Session with id {id} not found.");
        }

        return session;
    }

    public async Task<Result<IReadOnlyList<SessionResponse>>> GetUpcomingAsync()
    {
        var session = await dbContext.Set<Session>()
            .AsNoTracking()
            .Where(s => s.SessionDate >= DateOnly.FromDateTime(DateTime.Now))
            .OrderBy(s => s.SessionDate)
            .Select(s => new SessionResponse(
                s.Id,
                s.ClassTypeId,
                s.ClassType.Name,
                s.InstructorId,
                $"{s.Instructor.AppUser.FirstName} {s.Instructor.AppUser.LastName}",
                s.TimeSlotId,
                s.TimeSlot.StartTime,
                s.TimeSlot.DurationInMinutes,
                s.TimeSlot.DayOfWeek.ToString(),
                s.Price,
                s.SessionDate,
                s.Status,
                s.TotalSeats
            ))
            .ToListAsync();

        if (session.Count == 0)
        {
            return Result.Failure(ErrorType.NotFound, "There are no upcoming sessions.");
        }

        return session;
    }
}
