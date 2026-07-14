using System;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Instructors.Read;

public class InstructorReadService(IDbContext dbContext)
{
    public async Task<IReadOnlyList<InstructorResponse>> GetAllAsync()
    {
        return await dbContext.Set<Instructor>()
        .AsNoTracking()
            .Select(i => new InstructorResponse
            (
                i.Id,
                i.AppUser.FirstName,
                i.AppUser.LastName,
                i.AppUser.PhoneNumber,
                i.AppUser.Email,
                i.AppUser.DateOfBirth ?? DateOnly.MinValue,
                i.AppUser.Bio ?? string.Empty,
                i.AppUser.ImageUrl ?? string.Empty,
                i.QualifiedClassTypes.Select(ct => ct.Name).ToList()
            ))
            .ToListAsync();
    }

    public async Task<Result<InstructorResponse>> GetByIdAsync(int id)
    {
        var instructor = await dbContext.Set<Instructor>()
        .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(i => new InstructorResponse
            (
                i.Id,
                i.AppUser.FirstName,
                i.AppUser.LastName,
                i.AppUser.PhoneNumber,
                i.AppUser.Email,
                i.AppUser.DateOfBirth ?? DateOnly.MinValue,
                i.AppUser.Bio ?? string.Empty,
                i.AppUser.ImageUrl ?? string.Empty,
                i.QualifiedClassTypes.Select(ct => ct.Name).ToList()
            ))
            .FirstOrDefaultAsync();

        if (instructor is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Instructor with id {id} not found.");
        }

        return instructor;
    }

    public async Task<Result<InstructorResponse>> GetByUserIdAsync(string userId)
    {

        var instructor = await dbContext.Set<Instructor>()
            .AsNoTracking()
            .Where(i => i.UserId == userId)
            .Select(i => new InstructorResponse
            (
                i.Id,
                i.AppUser.FirstName,
                i.AppUser.LastName,
                i.AppUser.PhoneNumber,
                i.AppUser.Email,
                i.AppUser.DateOfBirth ?? DateOnly.MinValue,
                i.AppUser.Bio ?? string.Empty,
                i.AppUser.ImageUrl ?? string.Empty,
                i.QualifiedClassTypes.Select(ct => ct.Name).ToList()
            ))
            .FirstOrDefaultAsync();

        if (instructor is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Instructor for user with id {userId} not found.");
        }

        return instructor;
    }
}
