using Core.Features.Users;
using Core.Models;
using Core.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Photos.AddPhoto
{
    public class AddPhotoToStudentUseCase(
        IPhotoService photoService,
        IDbContext dbContext)
    {
        public async Task<Result<string>> ExecuteAsync(string userId, IFormFile imageFile)
        {
            var existingStudent = await dbContext.Set<Student>().FirstOrDefaultAsync(s => s.UserId == userId);

            if (existingStudent == null)
            {
                return Result.Failure(ErrorType.NotFound, "Student not found.");
            }

            var uploadResult = await photoService.AddPhotoAsync(imageFile);

            if (uploadResult.Error != null)
            {
                return Result.Failure(ErrorType.PhotoUploadError, uploadResult.Error.Message);
            }

            existingStudent.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;

            await dbContext.SaveChangesAsync();

            return existingStudent.ImageUrl;
        }
    }
}
