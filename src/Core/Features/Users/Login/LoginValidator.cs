using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Features.Users.Login
{
    public class LoginValidator : AbstractValidator<LoginRequest>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress().WithMessage("Invalid email format");
            RuleFor(x => x.Password)
                .NotEmpty();
        }
    }
}
