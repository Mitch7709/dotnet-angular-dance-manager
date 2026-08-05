using API.Extensions;
using Core.Features.Users.Login;
using Core.Features.Users.Register;
using Core.Features.Users.Update;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.FileProviders;

namespace API.Modules;

public class UserModule : IModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users")
            .WithTags("Users");

        group.MapPost("/register/student", RegisterStudent)
            .Validator<RegisterStudentRequest>();
        group.MapPost("/register/instructor", RegisterInstructor)
            .Validator<RegisterInstructorRequest>()
            .RequireAuthorization(Security.AdminPolicy);

        group.MapPost("/login", Login)
            .Validator<LoginRequest>();

        group.MapPut("/{userId}", UpdateUser)
            .Validator<UpdateUserRequest>()
            .RequireAuthorization();
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

    private static async Task<Results<Ok<UpdateUserResponse>, NotFound<string>>> UpdateUser(string userId, UpdateUserRequest request, UpdateUserUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(userId, request);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }
}
