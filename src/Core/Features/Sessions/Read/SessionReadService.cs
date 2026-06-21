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
                s.InstructorId,
                s.TimeSlotId,
                s.Price,
                s.SessionDate,
                s.Status
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
                s.InstructorId,
                s.TimeSlotId,
                s.Price,
                s.SessionDate,
                s.Status
            ))
            .FirstOrDefaultAsync();

        if (session is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Session with id {id} not found.");
        }

        return session;
    }
}
