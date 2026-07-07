using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.EntityConfigurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.Property(x => x.FirstName)
            .IsRequired()
            .HasMaxLength(AppUser.MaxLength.FirstName);
        builder.Property(x => x.LastName)
            .IsRequired()
            .HasMaxLength(AppUser.MaxLength.LastName);
        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(AppUser.MaxLength.Email);
        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(AppUser.MaxLength.PhoneNumber);
        builder.Property(x => x.ImageUrl)
            .HasMaxLength(AppUser.MaxLength.ImageUrl);
    }
}
