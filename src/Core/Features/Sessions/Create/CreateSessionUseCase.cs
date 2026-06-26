using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Sessions.Create;

public class CreateSessionUseCase(IDbContext dbContext)
{
    public async Task<Result<CreateSessionResponse>> ExecuteAsync(CreateSessionRequest request)
    {
        var classTypeExists = await dbContext.Set<ClassType>()
            .AnyAsync(ct => ct.Id == request.ClassTypeId);

        if (!classTypeExists)
        {
            return Result.Failure(ErrorType.NotFound, $"ClassType with id {request.ClassTypeId} not found.");
        }

        var instructorExists = await dbContext.Set<Instructor>()
            .AnyAsync(i => i.Id == request.InstructorId);

        if (!instructorExists)
        {
            return Result.Failure(ErrorType.NotFound, $"Instructor with id {request.InstructorId} not found.");
        }

        // Verify if provided TimeSlot exists and if provided SessionDate matches the given TimeSlot's DayOfWeek
        var timeSlot = await dbContext.Set<TimeSlot>()
            .FirstAsync(ts => ts.Id == request.TimeSlotId && ts.IsActive);

        if (timeSlot == null)
        {
            return Result.Failure(ErrorType.NotFound, $"TimeSlot with id {request.TimeSlotId} not found or inactive.");
        }

        if (timeSlot.DayOfWeek != request.SessionDate.DayOfWeek)
        {
            return Result.Failure(ErrorType.ValidationError, $"SessionDate {request.SessionDate} does not match the DayOfWeek for the given TimeSlot");
        }

        // Verify if the provided TimeSlot is not already occupied by a different session.
        var isTimeSlotOccupied = await dbContext.Set<Session>()
            .AnyAsync(s => s.TimeSlotId == request.TimeSlotId && s.SessionDate == request.SessionDate);

        if (isTimeSlotOccupied)
        {
            return Result.Failure(ErrorType.ValidationError, "A different session already occupies the provided TimeSlot.");
        }

        var session = new Session
        {
            ClassTypeId = request.ClassTypeId,
            InstructorId = request.InstructorId,
            TimeSlotId = request.TimeSlotId,
            Price = request.Price,
            SessionDate = request.SessionDate,
            Status = request.Status
        };

        dbContext.Set<Session>().Add(session);
        await dbContext.SaveChangesAsync();

        return new CreateSessionResponse(
            session.Id,
            session.ClassTypeId,
            session.InstructorId,
            session.TimeSlotId,
            session.Price,
            session.SessionDate,
            session.Status
        );
    }
}
