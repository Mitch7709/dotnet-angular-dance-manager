using Core.Models;

namespace Core.Features.Students.Update.UpdateWaiver;

public record UpdateWaiverStatusRequest(
    string Status
);

public record UpdateWaiverStatusResponse(
    int Id,
    WaiverStatus WaiverStatus
);
