using FluentValidation;

namespace Core.Features.Users.Update;

public class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name is required");
        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name is required");
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .WithMessage("A valid email is required");
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .Matches(@"^\d{3}-?\d{3}-?\d{4}$")
            .WithMessage("A valid phone number is required");
    }
}
