using System.Linq;
using System.Threading.Tasks;
using Core.Features.ClassTypes.Read;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.ClassTypes.Update;

public class UpdateClassTypeUseCase(IDbContext dbContext)
{
    public async Task<Result<UpdateClassTypeResponse>> ExecuteAsync(int classTypeId, UpdateClassTypeRequest request)
    {
        var classType = await dbContext.Set<ClassType>()
            .Include(ct => ct.QualifiedInstructors)
            .FirstOrDefaultAsync(ct => ct.Id == classTypeId);

        if (classType is null)
            return Result.Failure(ErrorType.NotFound, $"ClassType with id {classTypeId} was not found");

        var instructors = await dbContext.Set<Instructor>()
            .Where(i => request.QualifiedInstructorIds.Contains(i.Id))
            .ToListAsync();

        if (instructors.Count != request.QualifiedInstructorIds.Count)
            return Result.Failure(ErrorType.ValidationError, "One or more instructor IDs are invalid.");

        classType.Name = request.Name;
        classType.Description = request.Description;
        classType.Style = request.Style;
        classType.Level = request.Level;
        classType.IsActive = request.IsActive;

        classType.QualifiedInstructors.Clear();
        foreach (var instructor in instructors)
            classType.QualifiedInstructors.Add(instructor);

        await dbContext.SaveChangesAsync();

        return new UpdateClassTypeResponse(
            classType.Id,
            classType.Name,
            classType.Description,
            classType.Style,
            classType.Level,
            classType.IsActive,
            instructors.Select(i => i.Id).ToList()
        );
    }
}
