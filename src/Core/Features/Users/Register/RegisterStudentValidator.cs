using Core.Models;
using FluentValidation;

namespace Core.Features.Users.Register;

public class RegisterStudentValidator : AbstractValidator<RegisterStudentRequest>
{
    public RegisterStudentValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6);

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(AppUser.MaxLength.FirstName);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(AppUser.MaxLength.LastName);

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\d{3}-?\d{3}-?\d{4}$");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required for students.")
            .Must(BeAValidDate).WithMessage("Date of birth must be a valid date in the format YYYY-MM-DD.");
    }

    private bool BeAValidDate(string date)
    {
        return DateTime.TryParseExact(date, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out _);
    }
}