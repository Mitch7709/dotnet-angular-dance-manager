using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Core.Features.Users;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
    Task<ImageUploadResult> UpdatePhotoAsync(string publicId, IFormFile file);
    // Task<DeletionResult> DeletePhotoAsync(string publicId);
}