using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Bookings.Create;

public class CreateBookingUseCase(IDbContext dbContext)
{
    public async Task<Result<CreateBookingResponse>> ExecuteAsync(CreateBookingRequest request)
    {
        var session = await dbContext.Set<Session>()
            .FirstOrDefaultAsync(s => s.Id == request.SessionId);

        if (session is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Session with id {request.SessionId} not found.");
        }

        if (session.Status != SessionStatus.Scheduled)
        {
            return Result.Failure(ErrorType.ValidationError, $"Session with id {request.SessionId} is not available for booking.");
        }

        if (session.SessionDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return Result.Failure(ErrorType.ValidationError, $"Session with id {request.SessionId} has already occurred.");
        }

        var studentExists = await dbContext.Set<Student>()
            .AnyAsync(s => s.Id == request.StudentId);

        if (!studentExists)
        {
            return Result.Failure(ErrorType.NotFound, $"Student with id {request.StudentId} not found.");
        }

        var duplicateBooking = await dbContext.Set<Booking>()
            .AnyAsync(b => b.SessionId == request.SessionId
                        && b.StudentId == request.StudentId
                        && b.BookingStatus == BookingStatus.Active);

        if (duplicateBooking)
        {
            return Result.Failure(ErrorType.Conflict, $"Student with id {request.StudentId} already has an active booking for this session.");
        }

        var booking = new Booking
        {
            SessionId = request.SessionId,
            StudentId = request.StudentId,
            BookingDate = DateTime.UtcNow,
            PaymentStatus = PaymentStatus.Pending,
            BookingStatus = BookingStatus.Active,
            PriceAtBooking = session.Price
        };

        booking.ConfirmationId = booking.GenerateConfirmationId();

        dbContext.Set<Booking>().Add(booking);
        await dbContext.SaveChangesAsync();

        return new CreateBookingResponse(
            booking.Id,
            booking.SessionId,
            booking.StudentId,
            booking.BookingDate,
            booking.PaymentStatus,
            booking.ConfirmationId,
            booking.PriceAtBooking,
            booking.BookingStatus
        );
    }
}
