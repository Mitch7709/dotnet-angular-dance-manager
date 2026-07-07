using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models;

public class Instructor : BaseEntity
{
    public class MaxLength
    {
        public const int Bio = 500;
    }

    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public required AppUser AppUser { get; set; }
    public string? Bio { get; set; }

    public ICollection<ClassType> QualifiedClassTypes { get; set; } = [];
}
