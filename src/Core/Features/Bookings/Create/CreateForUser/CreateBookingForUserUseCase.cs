using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Bookings.Create.CreateForUser;

public class CreateBookingForUserUseCase(IUserContext userContext, IDbContext dbContext, CreateBookingUseCase createBookingUseCase)
{
    public async Task<Result<CreateBookingResponse>> ExecuteAsync(int sessionId)
    {
        var userId = userContext.GetUserId();

        var studentId = await dbContext.Set<Student>()
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .Select(s => s.Id)
            .FirstOrDefaultAsync();

        var createBookingRequest = new CreateBookingRequest
        (
            SessionId: sessionId,
            StudentId: studentId
        );

        return await createBookingUseCase.ExecuteAsync(createBookingRequest);
    }
}
