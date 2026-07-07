using Core.Features.Users;
using Core.Helpers;
using Core.Models;
using Core.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Photos.UpdatePhoto;

public class UpdateUserPhotoUseCase(IPhotoService photoService, IDbContext dbContext, IUserContext userContext)
{
    public async Task<Result<string>> ExecuteAsync(IFormFile imageFile)
    {
        var currentUser = userContext.GetUserId();

        var existingUser = await dbContext.Set<AppUser>().FirstOrDefaultAsync(s => s.Id == currentUser);

        if (existingUser == null || string.IsNullOrEmpty(existingUser.ImageUrl))
        {
            return Result.Failure(ErrorType.NotFound, "User could not be found or does not have an existing photo.");
        }

        var publicId = PhotoHelpers.GetImagePublicId(existingUser.ImageUrl);

        var uploadResult = await photoService.UpdatePhotoAsync(publicId, imageFile);

        if (uploadResult.Error != null)
        {
            return Result.Failure(ErrorType.PhotoUploadError, uploadResult.Error.Message);
        }

        existingUser.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;
        await dbContext.SaveChangesAsync();

        return existingUser.ImageUrl;
    }

}
