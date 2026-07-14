using Core.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Features.Students.Update
{
    public class UpdateStudentValidator : AbstractValidator<UpdateStudentRequest>
    {
        public UpdateStudentValidator()
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
            RuleFor(x => x.WaiverStatus)
                .NotEmpty()
                .Must(value => Enum.TryParse<WaiverStatus>(value, ignoreCase: true, out _))
                .WithMessage("Waiver status does not match any of the required statuses.");

        }
    }
}
