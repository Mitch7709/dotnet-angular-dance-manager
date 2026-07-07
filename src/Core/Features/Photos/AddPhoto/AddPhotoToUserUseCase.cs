using Core.Features.Users;
using Core.Models;
using Core.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Photos.AddPhoto
{
    public class AddPhotoToUserUseCase(
        IPhotoService photoService,
        IUserContext userContext, 
        IDbContext dbContext)
    {
        public async Task<Result<string>> ExecuteAsync(IFormFile imageFile)
        {
            var userId = userContext.GetUserId();

            var existingUser = await dbContext.Set<AppUser>().FirstOrDefaultAsync(s => s.Id == userId);

            if (existingUser == null)
            {
                return Result.Failure(ErrorType.NotFound, "User not found.");
            }

            var uploadResult = await photoService.AddPhotoAsync(imageFile);

            if (uploadResult.Error != null)
            {
                return Result.Failure(ErrorType.PhotoUploadError, uploadResult.Error.Message);
            }

            existingUser.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;

            await dbContext.SaveChangesAsync();

            return existingUser.ImageUrl;
        }
    }
}
