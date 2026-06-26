using System;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Instructors.Create;

public class CreateInstructorUseCase(IDbContext dbContext)
{
    public async Task<CreateInstructorResponse> ExecuteAsync(CreateInstructorRequest request)
    {
        var appUser = await dbContext.Set<AppUser>()
            .SingleAsync(u => u.Id == request.AppUserId);

        var instructor = new Instructor
        {
            UserId = appUser.Id,
            AppUser = appUser,
            Bio = request.Bio
        };

        dbContext.Set<Instructor>().Add(instructor);
        await dbContext.SaveChangesAsync();

        return new CreateInstructorResponse
        (
            instructor.Id,
            appUser.FirstName,
            appUser.LastName,
            appUser.Email,
            appUser.PhoneNumber
        );
    }
}
