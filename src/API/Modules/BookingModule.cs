using API.Extensions;
using Core.Features.Bookings.Create;
using Core.Features.Bookings.Create.CreateForUser;
using Core.Features.Bookings.Delete;
using Core.Features.Bookings.Read;
using Core.Features.Bookings.Update;
using Core.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Modules;

public class BookingModule : IModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/bookings")
            .WithTags("Bookings")
            .RequireAuthorization();

        group.MapGet("", GetBookings);
        group.MapGet("/{id}", GetBookingById);
        group.MapGet("/session/{sessionId}", GetBookingsForSession)
            .RequireAuthorization(Security.NonStudentPolicy);

        group.MapGet("/student", GetStudentBookings);

        group.MapPost("", CreateBooking)
            .Validator<CreateBookingRequest>();
        group.MapPost("/{sessionId}", CreateBookingForUser);

        group.MapPut("/{id}", UpdateBooking)
            .Validator<UpdateBookingRequest>();

        group.MapDelete("/{id}", DeleteBooking);
    }

    private static async Task<Ok<IReadOnlyList<BookingResponse>>> GetBookings(BookingReadService service)
    {
        var result = await service.GetAllAsync();
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<BookingResponse>, NotFound<string>>>
    GetBookingById(int id, BookingReadService service)
    {
        var result = await service.GetByIdAsync(id);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<IReadOnlyList<BookingResponse>>, NotFound<string>>>
        GetStudentBookings(BookingReadService service)
    {
        var result = await service.GetBookingsForStudent();
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<IReadOnlyList<BookingResponse>>, NotFound<string>>>
        GetBookingsForSession(int sessionId, BookingReadService service)
    {
        var result = await service.GetBookingsForSession(sessionId);
        return result.IsSuccess
            ? TypedResults.Ok(result.Value)
            : TypedResults.NotFound(result.ErrorMessage);
    }

    private static async Task<Results<Ok<CreateBookingResponse>, NotFound<string>, BadRequest<string>>>
        CreateBooking(CreateBookingRequest request, CreateBookingUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(request);
        if (result.IsSuccess)
            return TypedResults.Ok(result.Value);

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }

    private static async Task<Results<Ok<CreateBookingResponse>, NotFound<string>, BadRequest<string>>>
        CreateBookingForUser(int sessionId, CreateBookingForUserUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(sessionId);
        if (result.IsSuccess)
            return TypedResults.Ok(result.Value);

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }

    private static async Task<Results<Ok<UpdateBookingResponse>, NotFound<string>, BadRequest<string>>>
        UpdateBooking(int id, UpdateBookingRequest request, UpdateBookingUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id, request);
        if (result.IsSuccess)
            return TypedResults.Ok(result.Value);

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }

    private static async Task<Results<NoContent, NotFound<string>, BadRequest<string>>> DeleteBooking(int id, DeleteBookingUseCase useCase)
    {
        var result = await useCase.ExecuteAsync(id);
        if (result.IsSuccess)
            return TypedResults.NoContent();

        return result.ErrorType == ErrorType.NotFound
            ? TypedResults.NotFound(result.ErrorMessage)
            : TypedResults.BadRequest(result.ErrorMessage);
    }
}
