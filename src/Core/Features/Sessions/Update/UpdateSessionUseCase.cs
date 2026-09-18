using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Sessions.Update;

public class UpdateSessionUseCase(IDbContext dbContext)
{
    public async Task<Result<UpdateSessionResponse>> ExecuteAsync(int sessionId, UpdateSessionRequest request)
    {
        var session = await dbContext.Set<Session>()
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Session with id {sessionId} was not found");
        }

        var classTypeExists = await dbContext.Set<ClassType>()
            .AnyAsync(ct => ct.Id == request.ClassTypeId);

        if (!classTypeExists)
        {
            return Result.Failure(ErrorType.ValidationError, $"ClassType with id {request.ClassTypeId} not found.");
        }

        var instructorExists = await dbContext.Set<Instructor>()
            .AnyAsync(i => i.Id == request.InstructorId);

        if (!instructorExists)
        {
            return Result.Failure(ErrorType.ValidationError, $"Instructor with id {request.InstructorId} not found.");
        }

        var timeSlotExists = await dbContext.Set<TimeSlot>()
            .AnyAsync(ts => ts.Id == request.TimeSlotId);

        if (!timeSlotExists)
        {
            return Result.Failure(ErrorType.ValidationError, $"TimeSlot with id {request.TimeSlotId} not found.");
        }

        var sessionStatusParsed = Enum.Parse<SessionStatus>(request.Status, ignoreCase: true);

        session.ClassTypeId = request.ClassTypeId;
        session.InstructorId = request.InstructorId;
        session.TimeSlotId = request.TimeSlotId;
        session.Price = request.Price;
        session.SessionDate = request.SessionDate;
        session.Status = sessionStatusParsed;
        session.TotalSeats = request.TotalSeats;

        await dbContext.SaveChangesAsync();

        return new UpdateSessionResponse(
            session.Id,
            session.ClassTypeId,
            session.InstructorId,
            session.TimeSlotId,
            session.Price,
            session.SessionDate,
            session.Status,
            session.TotalSeats
        );
    }
}
