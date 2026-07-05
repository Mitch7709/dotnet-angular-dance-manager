using Core.Features.Users;
using Core.Models;
using Core.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Features.Bookings.Read;

public class BookingReadService(IDbContext dbContext, IUserContext userContext)
{
    public async Task<IReadOnlyList<BookingResponse>> GetAllAsync()
    {
        return await dbContext.Set<Booking>()
            .AsNoTracking()
            .OrderBy(b => b.Id)
            .Select(b => new BookingResponse(
                b.Id,
                new BookingSessionSummary(b.Session.Id, b.Session.SessionDate, b.Session.ClassType.Name),
                new BookingStudentSummary(b.Student.Id, $"{b.Student.AppUser.FirstName} {b.Student.AppUser.LastName}"),
                b.BookingDate,
                b.PaymentStatus,
                b.ConfirmationId,
                b.PriceAtBooking,
                b.BookingStatus
            ))
            .ToListAsync();
    }

    public async Task<Result<BookingResponse>> GetByIdAsync(int id)
    {
        var booking = await dbContext.Set<Booking>()
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new BookingResponse(
                b.Id,
                new BookingSessionSummary(b.Session.Id, b.Session.SessionDate, b.Session.ClassType.Name),
                new BookingStudentSummary(b.Student.Id, $"{b.Student.AppUser.FirstName} {b.Student.AppUser.LastName}"),
                b.BookingDate,
                b.PaymentStatus,
                b.ConfirmationId,
                b.PriceAtBooking,
                b.BookingStatus
            ))
            .FirstOrDefaultAsync();

        if (booking is null)
        {
            return Result.Failure(ErrorType.NotFound, $"Booking with id {id} not found.");
        }

        return booking;
    }

    public async Task<Result<IReadOnlyList<BookingResponse>>> GetBookingsForStudent()
    {
        var userId = userContext.GetUserId();

        var studentId = await dbContext.Set<Student>()
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .Select(s => s.Id)
            .FirstOrDefaultAsync();

        if (studentId == 0)
        {
            return Result.Failure(ErrorType.NotFound, "Student not found or user is not a student.");
        }

        var bookings = await dbContext.Set<Booking>()
            .AsNoTracking()
            .Where(b => b.StudentId == studentId)
            .OrderBy(b => b.Id)
            .Select(b => new BookingResponse(
                b.Id,
                new BookingSessionSummary(b.Session.Id, b.Session.SessionDate, b.Session.ClassType.Name),
                new BookingStudentSummary(b.Student.Id, $"{b.Student.AppUser.FirstName} {b.Student.AppUser.LastName}"),
                b.BookingDate,
                b.PaymentStatus,
                b.ConfirmationId,
                b.PriceAtBooking,
                b.BookingStatus
            ))
            .ToListAsync();
        if (bookings.Count == 0)
        {
            return Result.Failure(ErrorType.NotFound, $"No bookings found for student with id {studentId}.");
        }
        return bookings;
    }

    public async Task<Result<IReadOnlyList<BookingResponse>>> GetBookingsForSession(int sessionId)
    {
        var bookings = await dbContext.Set<Booking>()
            .AsNoTracking()
            .Where(b => b.SessionId == sessionId)
            .OrderBy(b => b.Id)
            .Select(b => new BookingResponse(
                b.Id,
                new BookingSessionSummary(b.Session.Id, b.Session.SessionDate, b.Session.ClassType.Name),
                new BookingStudentSummary(b.Student.Id, $"{b.Student.AppUser.FirstName} {b.Student.AppUser.LastName}"),
                b.BookingDate,
                b.PaymentStatus,
                b.ConfirmationId,
                b.PriceAtBooking,
                b.BookingStatus
            ))
            .ToListAsync();
        if (bookings.Count == 0)
        {
            return Result.Failure(ErrorType.NotFound, $"No bookings found for session with id {sessionId}.");
        }
        return bookings;
    }
}
