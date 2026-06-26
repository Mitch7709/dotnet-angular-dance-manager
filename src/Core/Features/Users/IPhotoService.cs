using Microsoft.AspNetCore.Http;
using CloudinaryDotNet.Actions;

namespace Core.Features.Users;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoAsync(string publicId);
}