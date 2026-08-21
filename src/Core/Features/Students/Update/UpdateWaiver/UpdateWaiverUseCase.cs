using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Students.Update.UpdateWaiver;

public class UpdateWaiverUseCase(IDbContext dbContext)
{
    public async Task<Result<UpdateWaiverStatusResponse>> ExecuteAsync(int studentId, UpdateWaiverStatusRequest request)
    {
        var student = await dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student is null)
            return Result.Failure(ErrorType.NotFound, $"Student with id {studentId} was not found");

        student.WaiverStatus = Enum.Parse<WaiverStatus>(request.Status, ignoreCase: true);

        await dbContext.SaveChangesAsync();

        return new UpdateWaiverStatusResponse(student.Id, student.WaiverStatus);
    }
}
