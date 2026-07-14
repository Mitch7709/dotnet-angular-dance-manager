using System;
using Core.Features.Students.Create;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Students.Read;

public class StudentReadService(IDbContext dbContext)
{
    public async Task<IReadOnlyList<StudentResponse>> GetAllAsync()
    {
        return await dbContext.Set<Student>()
            .Select(s => new StudentResponse
            (
                s.Id,
                s.AppUser.FirstName,
                s.AppUser.LastName,
                s.AppUser.PhoneNumber,
                s.AppUser.Email,
                s.AppUser.DateOfBirth ?? DateOnly.MinValue,
                s.AppUser.Bio ?? string.Empty,
                s.WaiverStatus,
                s.AppUser.ImageUrl ?? string.Empty
            ))
            .ToListAsync();
    }

    public async Task<Result<StudentResponse>> GetByIdAsync(int id)
    {
        var student = await dbContext.Set<Student>()
            .Where(s => s.Id == id)
            .Select(s => new StudentResponse
            (
                s.Id,
                s.AppUser.FirstName,
                s.AppUser.LastName,
                s.AppUser.PhoneNumber,
                s.AppUser.Email,
                s.AppUser.DateOfBirth ?? DateOnly.MinValue,
                s.AppUser.Bio ?? string.Empty,
                s.WaiverStatus,
                s.AppUser.ImageUrl ?? string.Empty
            ))
            .FirstOrDefaultAsync();

        if (student is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Student with id {id} not found.");
        }

        return student;
    }

    public async Task<Result<StudentResponse>> GetByUserIdAsync(string userId)
    {

        var student = await dbContext.Set<Student>()
            .Where(s => s.AppUser.Id == userId)
            .Select(s => new StudentResponse
            (
                s.Id,
                s.AppUser.FirstName,
                s.AppUser.LastName,
                s.AppUser.PhoneNumber,
                s.AppUser.Email,
                s.AppUser.DateOfBirth ?? DateOnly.MinValue,
                s.AppUser.Bio ?? string.Empty,
                s.WaiverStatus,
                s.AppUser.ImageUrl ?? string.Empty
            ))
            .FirstOrDefaultAsync();

        if (student is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Student for user with id {userId} not found.");
        }

        return student;
    }

}
