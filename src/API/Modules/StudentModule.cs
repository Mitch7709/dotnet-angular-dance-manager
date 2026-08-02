using API.Extensions;
using Core.Features.Students.Create;
using Core.Features.Students.Delete;
using Core.Features.Students.Read;
using Core.Features.Students.Update;
using Core.Features.Users.Register;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;


namespace API.Modules;

public class StudentModule : IModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/students")
            .WithTags("Students");

        group.MapGet("", GetStudents);
        group.MapGet("/{id}", GetStudentById);
        group.MapGet("/me", GetStudentByUserId);

        group.MapPut("/{id}", UpdateStudent)
            .Validator<UpdateStudentRequest>();

        group.MapDelete("/{id}", DeleteStudent);
    }

    private static async Task<Ok<IReadOnlyList<StudentResponse>>> GetStudents(StudentReadService service)
    {
        var result = await service.GetAllAsync();
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<StudentResponse>, NotFound<string>>> GetStudentById(int id, StudentReadService service)
    {
        var result = await service.GetByIdAsync(id);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<StudentResponse>, NotFound<string>>> GetStudentByUserId(string userId, StudentReadService service)
    {
        var result = await service.GetByUserIdAsync(userId);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<UpdateStudentResponse>, NotFound<string>>> UpdateStudent(int id, UpdateStudentRequest request, UpdateStudentUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id, request);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<NoContent, NotFound<string>, BadRequest<string>>> DeleteStudent(int id, DeleteStudentUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id);

        if (result.IsSuccess)
            return TypedResults.NoContent();

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }
}
