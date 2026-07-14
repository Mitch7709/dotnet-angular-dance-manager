using System;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Instructors.Update;

public class UpdateInstructorUseCase(IDbContext dbContext)
{
    public async Task<Result<UpdateInstructorResponse>> ExecuteAsync(int instructorId, UpdateInstructorRequest request)
    {
        var instructor = await dbContext.Set<Instructor>()
            .Include(i => i.AppUser)
            .FirstOrDefaultAsync(i => i.Id == instructorId);
        if (instructor is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Instructor with id {instructorId} was not found");
        }

        instructor.AppUser.FirstName = request.FirstName;
        instructor.AppUser.LastName = request.LastName;
        instructor.AppUser.PhoneNumber = request.PhoneNumber;
        instructor.AppUser.Email = request.Email;
        instructor.AppUser.Bio = request.Bio;
        instructor.AppUser.ImageUrl = request.ImageUrl;

        await dbContext.SaveChangesAsync();

        return new UpdateInstructorResponse(
            instructor.Id,
            instructor.AppUser.FirstName,
            instructor.AppUser.LastName,
            instructor.AppUser.PhoneNumber,
            instructor.AppUser.Email,
            instructor.AppUser.Bio,
            instructor.AppUser.ImageUrl
        );
    }
}
