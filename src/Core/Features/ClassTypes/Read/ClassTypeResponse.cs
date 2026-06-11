using System;
using System.Collections.Generic;

namespace Core.Features.ClassTypes.Read;

public record ClassTypeResponse(
    int Id,
    string Name,
    string Description,
    string Style,
    int Level,
    bool IsActive,
    IReadOnlyList<int> QualifiedInstructorIds
);