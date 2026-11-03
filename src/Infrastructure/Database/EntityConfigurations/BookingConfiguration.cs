using System;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.EntityConfigurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Bookings");
        builder.HasKey(b => b.Id);

        builder.Property(b => b.BookingDate);

        builder.Property(b => b.PaymentStatus)
            .IsRequired()
            .HasConversion<string>();
        builder.Property(b => b.BookingStatus)
            .IsRequired()
            .HasConversion<string>();
        builder.Property(b => b.ConfirmationId)
            .HasMaxLength(20)
            .IsRequired();
        builder.Property(b => b.PriceAtBooking)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.HasOne(b => b.Student)
            .WithMany(s => s.Bookings)
            .HasForeignKey(b => b.StudentId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(b => b.Session)
            .WithMany(s => s.Bookings)
            .HasForeignKey(b => b.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex(b => new { b.StudentId, b.SessionId })
            .IsUnique();
    }
}
