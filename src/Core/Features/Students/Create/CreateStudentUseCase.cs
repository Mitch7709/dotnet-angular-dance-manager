using System;
using Core.Features.Users;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Students.Create;

public class CreateStudentUseCase(IDbContext dbContext)
{
    public async Task<CreateStudentResponse> ExecuteAsync(CreateStudentRequest request)
    {
        var appUser = await dbContext.Set<AppUser>()
            .SingleAsync(u => u.Id == request.AppUserId);

        var student = new Student
        {
            UserId = appUser.Id,
            AppUser = appUser,
            WaiverStatus = WaiverStatus.NotSigned
        };

        dbContext.Set<Student>().Add(student);
        await dbContext.SaveChangesAsync();

        return new CreateStudentResponse
        (
            student.Id,
            appUser.FirstName,
            appUser.LastName,
            appUser.Email,
            appUser.PhoneNumber
        );
    }
}
