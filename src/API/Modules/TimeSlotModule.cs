using API.Extensions;
using Core.Features.TimeSlots.Create;
using Core.Features.TimeSlots.Delete;
using Core.Features.TimeSlots.Read;
using Core.Features.TimeSlots.Update;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Modules;

public class TimeSlotModule : IModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/time-slots")
            .WithTags("Time Slots")
            .RequireAuthorization(Security.AdminPolicy);

        group.MapGet("", GetTimeSlots);
        group.MapGet("/{id}", GetTimeSlotById);
        group.MapGet("/active", GetActiveTimeSlots);

        group.MapPost("", CreateTimeSlot)
            .Validator<CreateTimeSlotRequest>();

        group.MapPut("/{id}", UpdateTimeSlot)
            .Validator<UpdateTimeSlotRequest>();

        group.MapDelete("/{id}", DeleteTimeSlot);
    }

    private static async Task<Ok<IReadOnlyList<TimeSlotResponse>>> GetTimeSlots(TimeSlotReadService service)
    {
        var result = await service.GetAllAsync();
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<IReadOnlyList<TimeSlotResponse>>> GetActiveTimeSlots(TimeSlotReadService service)
    {
        var result = await service.GetActiveAsync();
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<TimeSlotResponse>, NotFound<string>>> GetTimeSlotById(int id, TimeSlotReadService service)
    {
        var result = await service.GetByIdAsync(id);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<CreateTimeSlotResponse>, BadRequest<string>, Conflict<string>>>
        CreateTimeSlot(CreateTimeSlotRequest request, CreateTimeSlotUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(request);
        if (result.IsSuccess)
            return TypedResults.Ok(result.Value);

        return result.ErrorType == ErrorType.Conflict
            ? TypedResults.Conflict(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }

    private static async Task<Results<Ok<UpdateTimeSlotResponse>, NotFound<string>, Conflict<string>>>
        UpdateTimeSlot(int id, UpdateTimeSlotRequest request, UpdateTimeSlotUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id, request);
        if (result.IsSuccess)
            return TypedResults.Ok(result.Value);

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.Conflict(result.ErrorMessage);
    }

    private static async Task<Results<NoContent, NotFound<string>, BadRequest<string>>> DeleteTimeSlot(int id, DeleteTimeSlotUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id);
        if (result.IsSuccess)
            return TypedResults.NoContent();

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }
}
