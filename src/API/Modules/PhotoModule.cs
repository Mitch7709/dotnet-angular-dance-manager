using Core.Features.Photos.AddPhoto;
using Core.Features.Photos.UpdatePhoto;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Modules
{
    public class PhotoModule : IModule
    {
        public void MapEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/photos")
                .WithTags("Photos")
                .RequireAuthorization()
                .DisableAntiforgery();

            group.MapPost("/student/{userId}", AddPhotoToStudent);
            group.MapPut("/student/{userId}", UpdateStudentPhoto);
        }
        private static async Task<Results<Ok<string>, NotFound<string>, UnprocessableEntity<string>>>
            AddPhotoToStudent(string userId, [FromForm]IFormFile imageFile, AddPhotoToStudentUseCase useCase)
        {
            var result = await useCase.ExecuteAsync(userId, imageFile);
            return result switch
            {
                { IsSuccess: true } => TypedResults.Ok(result.Value),
                { IsFailure: true, ErrorType: ErrorType.NotFound } => TypedResults.NotFound(result.ErrorMessage),
                { IsFailure: true, ErrorType: ErrorType.PhotoUploadError } => TypedResults.UnprocessableEntity(result.ErrorMessage),
                _ => throw new NotImplementedException()
            };
        }
        private static async Task<Results<Ok<string>, NotFound<string>, UnprocessableEntity<string>>>
            UpdateStudentPhoto(string userId, [FromForm]IFormFile imageFile, UpdateStudentPhotoUseCase useCase)
        {
            var result = await useCase.ExecuteAsync(userId, imageFile);
            return result switch
            {
                { IsSuccess: true } => TypedResults.Ok(result.Value),
                { IsFailure: true, ErrorType: ErrorType.NotFound } => TypedResults.NotFound(result.ErrorMessage),
                { IsFailure: true, ErrorType: ErrorType.PhotoUploadError } => TypedResults.UnprocessableEntity(result.ErrorMessage),
                _ => throw new NotImplementedException()
            };
        }
    }
}
