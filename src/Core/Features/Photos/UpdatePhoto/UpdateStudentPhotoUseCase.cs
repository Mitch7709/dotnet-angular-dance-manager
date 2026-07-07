using Core.Features.Users;
using Core.Helpers;
using Core.Models;
using Core.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Photos.UpdatePhoto;

public class UpdateStudentPhotoUseCase(IPhotoService photoService, IDbContext dbContext)
{
    public async Task<Result<string>> ExecuteAsync(string studentId, IFormFile imageFile)
    {
        var existingStudent = await dbContext.Set<Student>().FirstOrDefaultAsync(s => s.UserId == studentId);

        if (existingStudent == null || string.IsNullOrEmpty(existingStudent.AppUser.ImageUrl))
        {
            return Result.Failure(ErrorType.NotFound, "Student could not be found or does not have an existing photo.");
        }

        var publicId = PhotoHelpers.GetImagePublicId(existingStudent.AppUser.ImageUrl);

        var uploadResult = await photoService.UpdatePhotoAsync(publicId, imageFile);

        if (uploadResult.Error != null)
        {
            return Result.Failure(ErrorType.PhotoUploadError, uploadResult.Error.Message);
        }

        existingStudent.AppUser.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;
        await dbContext.SaveChangesAsync();

        return existingStudent.AppUser.ImageUrl;
    }

}
