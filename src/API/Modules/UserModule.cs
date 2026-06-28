using API.Extensions;
using Core.Features.Users.Login;
using Core.Features.Users.Register;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Modules;

public class UserModule : IModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost("/register/student", RegisterStudent)
            .WithTags("Users")
            .Validator<RegisterStudentRequest>();
        app.MapPost("/register/instructor", RegisterInstructor)
            .WithTags("Users")
            .Validator<RegisterInstructorRequest>();

        app.MapPost("/login", Login)
            .WithTags("Users")
            .Validator<LoginRequest>();
    }

    private static async Task<IResult> Login(LoginRequest request, LoginUseCase useCase)
    {
        Result<LoginResponse>? result = await useCase.Execute(request);

        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : Results.Json(new { Error = result.ErrorMessage, Code = "UNAUTHORIZED_ACCESS"}, statusCode: 401);
    }

    private static async Task<Results<Ok<RegisterResponse>, BadRequest<string>, UnprocessableEntity<string>>>
        RegisterStudent(RegisterStudentRequest request, RegisterStudentUseCase useCase)
    {
        var result = await useCase.Execute(request);

        return result switch
        {
            { IsSuccess: true } => TypedResults.Ok(result.Value),
            { IsFailure: true, ErrorType: ErrorType.ValidationError } => TypedResults.BadRequest(result.ErrorMessage),
            { IsFailure: true } => TypedResults.UnprocessableEntity(result.ErrorMessage),
            _ => throw new NotImplementedException()
        };
    }

    private static async Task<Results<Ok<RegisterResponse>, BadRequest<string>, UnprocessableEntity<string>>>
        RegisterInstructor(RegisterInstructorRequest request, RegisterInstructorUseCase useCase)
    {
        var result = await useCase.Execute(request);

        return result switch
        {
            { IsSuccess: true } => TypedResults.Ok(result.Value),
            { IsFailure: true, ErrorType: ErrorType.ValidationError } => TypedResults.BadRequest(result.ErrorMessage),
            { IsFailure: true } => TypedResults.UnprocessableEntity(result.ErrorMessage),
            _ => throw new NotImplementedException()
        };
    }

}
