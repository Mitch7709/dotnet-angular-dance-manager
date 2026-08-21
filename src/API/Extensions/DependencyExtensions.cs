using API.Shared;
using Core.Features.Bookings.Create;
using Core.Features.Bookings.Create.CreateForUser;
using Core.Features.Bookings.Delete;
using Core.Features.Bookings.Read;
using Core.Features.Bookings.Update;
using Core.Features.ClassTypes.Create;
using Core.Features.ClassTypes.Delete;
using Core.Features.ClassTypes.Read;
using Core.Features.ClassTypes.Update;
using Core.Features.Instructors.Create;
using Core.Features.Instructors.Delete;
using Core.Features.Instructors.Read;
using Core.Features.Instructors.Update;
using Core.Features.Photos.AddPhoto;
using Core.Features.Photos.UpdatePhoto;
using Core.Features.Sessions.Create;
using Core.Features.Sessions.Delete;
using Core.Features.Sessions.Read;
using Core.Features.Sessions.Update;
using Core.Features.Students.Create;
using Core.Features.Students.Delete;
using Core.Features.Students.Read;
using Core.Features.Students.Update;
using Core.Features.Students.Update.UpdateWaiver;
using Core.Features.TimeSlots.Create;
using Core.Features.TimeSlots.Delete;
using Core.Features.TimeSlots.Read;
using Core.Features.TimeSlots.Update;
using Core.Features.Users;
using Core.Features.Users.Login;
using Core.Features.Users.Read;
using Core.Features.Users.Register;
using Core.Features.Users.Update;
using Core.Shared;
using FluentValidation;
using Infrastructure.Database;
using Infrastructure.Identity;
using Infrastructure.Image;

namespace API.Extensions;

public static class DependencyExtensions
{
    public static IServiceCollection AddDepedencyInjection(this IServiceCollection services)
    {
        services.AddScoped<IDbContext, AppDbContext>();

        services.AddTransient<CreateStudentUseCase>();
        services.AddTransient<UpdateStudentUseCase>();
        services.AddTransient<UpdateWaiverUseCase>();
        services.AddTransient<StudentReadService>();
        services.AddTransient<DeleteStudentUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateStudentValidator>();
        services.AddValidatorsFromAssemblyContaining<UpdateWaiverValidator>();

        services.AddTransient<CreateInstructorUseCase>();
        services.AddTransient<UpdateInstructorUseCase>();
        services.AddTransient<InstructorReadService>();
        services.AddTransient<DeleteInstructorUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateInstructorValidator>();

        services.AddTransient<CreateClassTypeUseCase>();
        services.AddTransient<UpdateClassTypeUseCase>();
        services.AddTransient<ClassTypeReadService>();
        services.AddTransient<DeleteClassTypeUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateClassTypeValidator>();
        services.AddValidatorsFromAssemblyContaining<CreateClassTypeValidator>();

        services.AddTransient<CreateTimeSlotUseCase>();
        services.AddTransient<UpdateTimeSlotUseCase>();
        services.AddTransient<TimeSlotReadService>();
        services.AddTransient<DeleteTimeSlotUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateTimeSlotValidator>();
        services.AddValidatorsFromAssemblyContaining<CreateTimeSlotValidator>();

        services.AddTransient<CreateSessionUseCase>();
        services.AddTransient<UpdateSessionUseCase>();
        services.AddTransient<SessionReadService>();
        services.AddTransient<DeleteSessionUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateSessionValidator>();
        services.AddValidatorsFromAssemblyContaining<CreateSessionValidator>();

        services.AddTransient<CreateBookingUseCase>();
        services.AddTransient<CreateBookingForUserUseCase>();
        services.AddTransient<UpdateBookingUseCase>();
        services.AddTransient<BookingReadService>();
        services.AddTransient<DeleteBookingUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateBookingValidator>();
        services.AddValidatorsFromAssemblyContaining<CreateBookingValidator>();


        services.AddTransient<RegisterStudentUseCase>();
        services.AddTransient<RegisterInstructorUseCase>();
        services.AddValidatorsFromAssemblyContaining<RegisterStudentValidator>();
        services.AddValidatorsFromAssemblyContaining<RegisterInstructorValidator>();

        services.AddTransient<LoginUseCase>();
        services.AddValidatorsFromAssemblyContaining<LoginValidator>();

        services.AddTransient<UserReadService>();
        services.AddTransient<UpdateUserUseCase>();
        services.AddValidatorsFromAssemblyContaining<UpdateUserValidator>();

        services.AddTransient<AddPhotoToUserUseCase>();
        services.AddTransient<UpdateUserPhotoUseCase>();

        services.AddTransient<ITokenService, TokenService>();
        services.AddTransient<IPhotoService, PhotoService>();
        services.AddTransient<IUserService, UserService>();
        services.AddTransient<IUserContext, UserContext>();

        return services;
    }

}
