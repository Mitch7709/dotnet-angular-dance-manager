using Core.Models;
using FluentValidation;

namespace Core.Features.Students.Update.UpdateWaiver;

public class UpdateWaiverValidator :AbstractValidator<UpdateWaiverStatusRequest>
{
    public UpdateWaiverValidator()
    {
        RuleFor(x => x.Status)
                .NotEmpty()
                .Must(value => Enum.TryParse<WaiverStatus>(value, ignoreCase: true, out _))
                .WithMessage("Waiver status does not match any of the required statuses.");
    }
}
