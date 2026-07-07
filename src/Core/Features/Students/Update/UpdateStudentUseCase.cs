using System;
using Core.Models;
using Core.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Students.Update;

public class UpdateStudentUseCase(IDbContext dbContext)
{
    public async Task<Result<UpdateStudentResponse>> ExecuteAsync(int studentId, UpdateStudentRequest request)
    {
        var student = await dbContext.Set<Student>()
            .Include(s => s.AppUser)
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student is null)
            return Result.Failure(ErrorType.NotFound, $"Student with id {studentId} was not found");

        // Update custom properties directly on the existing tracked entity
        student.AppUser.FirstName = request.FirstName;
        student.AppUser.LastName = request.LastName;
        student.AppUser.Email = request.Email;
        student.AppUser.PhoneNumber = request.PhoneNumber;
        student.DateOfBirth = request.DateOfBirth;
        student.AppUser.ImageUrl = request.ImageUrl;
        student.WaiverStatus = Enum.Parse<WaiverStatus>(request.WaiverStatus, ignoreCase: true);

        await dbContext.SaveChangesAsync();

        return new UpdateStudentResponse(
            student.Id,
            student.AppUser.FirstName,
            student.AppUser.LastName,
            student.AppUser.PhoneNumber,
            student.AppUser.Email,
            student.DateOfBirth,
            student.AppUser.ImageUrl,
            student.WaiverStatus
        );
    }
}
