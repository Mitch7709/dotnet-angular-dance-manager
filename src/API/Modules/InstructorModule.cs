using API.Extensions;
using Core.Features.Instructors.Delete;
using Core.Features.Instructors.Read;
using Core.Features.Instructors.Update;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Modules;

public class InstructorModule : IModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/instructors")
            .WithTags("Instructors");

        group.MapGet("", GetInstructors);
        group.MapGet("/{id}", GetInstructorById);
        group.MapGet("/me", GetInstructorByUserId);

        group.MapPut("/{id}", UpdateInstructor)
            .Validator<UpdateInstructorRequest>();

        group.MapDelete("/{id}", DeleteInstructor);
    }

    private static async Task<Ok<IReadOnlyList<InstructorResponse>>> GetInstructors(InstructorReadService service)
    {
        var result = await service.GetAllAsync();
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<InstructorResponse>, NotFound<string>>> GetInstructorById(int id, InstructorReadService service)
    {
        var result = await service.GetByIdAsync(id);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<UpdateInstructorResponse>, NotFound<string>>> UpdateInstructor(int id, UpdateInstructorRequest request, UpdateInstructorUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id, request);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<NoContent, NotFound<string>, BadRequest<string>>> DeleteInstructor(int id, DeleteInstructorUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id);

        if (result.IsSuccess)
            return TypedResults.NoContent();
        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }
    private static async Task<Results<Ok<InstructorResponse>, NotFound<string>>> GetInstructorByUserId(InstructorReadService service)
    {
        var result = await service.GetByUserIdAsync();
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }
}