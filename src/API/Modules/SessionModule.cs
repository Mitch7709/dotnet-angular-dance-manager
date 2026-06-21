using API.Extensions;
using Core.Features.Sessions.Create;
using Core.Features.Sessions.Delete;
using Core.Features.Sessions.Read;
using Core.Features.Sessions.Update;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Modules
{
    public class SessionModule : IModule
    {
        public void MapEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/sessions")
                .WithTags("Sessions")
                .RequireAuthorization(Security.NonStudentPolicy);

            group.MapGet("", GetSessions);
            group.MapGet("/{id}", GetSessionById);

            group.MapPost("", CreateSession)
                .Validator<CreateSessionRequest>();

            group.MapPut("/{id}", UpdateSession)
                .Validator<UpdateSessionRequest>();

            group.MapDelete("/{id}", DeleteSession);
        }

        private static async Task<Ok<IReadOnlyList<SessionResponse>>> GetSessions(int? page, int? pageSize, SessionReadService service)
        {
            var result = await service.GetAllAsync(page.GetValueOrDefault(), pageSize.GetValueOrDefault());
            return TypedResults.Ok(result);
        }

        private static async Task<Results<Ok<SessionResponse>, NotFound<string>>> GetSessionById(int id, SessionReadService service)
        {
            var result = await service.GetByIdAsync(id);
            return result.IsSuccess
                ? TypedResults.Ok(result.Value)
                : TypedResults.NotFound(result.ErrorMessage);
        }

        private static async Task<Results<Ok<CreateSessionResponse>, NotFound<string>, BadRequest<string>>>
            CreateSession(CreateSessionRequest request, CreateSessionUseCase useCase)
        {
            var result = await useCase.ExecuteAsync(request);
            if (result.IsSuccess)
                return TypedResults.Ok(result.Value);

            return result.ErrorType == ErrorType.NotFound
                ? TypedResults.NotFound(result.ErrorMessage)
                : TypedResults.BadRequest(result.ErrorMessage);
        }

        private static async Task<Results<Ok<UpdateSessionResponse>, NotFound<string>, BadRequest<string>>>
            UpdateSession(int id, UpdateSessionRequest request, UpdateSessionUseCase useCase)
        {
            var result = await useCase.ExecuteAsync(id, request);
            if (result.IsSuccess)
                return TypedResults.Ok(result.Value);

            return result.ErrorType == ErrorType.NotFound
                ? TypedResults.NotFound(result.ErrorMessage)
                : TypedResults.BadRequest(result.ErrorMessage);
        }

        private static async Task<Results<NoContent, NotFound<string>, BadRequest<string>>> DeleteSession(int id, DeleteSessionUseCase useCase)
        {
            var result = await useCase.ExecuteAsync(id);
            if (result.IsSuccess)
                return TypedResults.NoContent();

            return result.ErrorType == ErrorType.NotFound
                ? TypedResults.NotFound(result.ErrorMessage)
                : TypedResults.BadRequest(result.ErrorMessage);
        }
    }
}
