using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Core.Models;

public class AppUser : IdentityUser, IEntity
{


    public AppUser(string email, string firstName, string lastName, string phoneNumber, DateOnly? dateOfBirth, string? bio)
    {
        Email = email;
        UserName = email;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        DateOfBirth = dateOfBirth;
        Bio = bio;
    }

    public static class MaxLength
    {
        public const int FirstName = 50;
        public const int LastName = 50;
        public const int PhoneNumber = 20;
        public const int Email = 100;
        public const int ImageUrl = 200;
        public const int Bio = 500;
    }

    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string? ImageUrl { get; set; }

    public DateOnly? DateOfBirth { get; set; }
    public string? Bio { get; set; }

    // Inverse navigations — disambiguates the two one-to-one relationships
    public Student? Student { get; set; }
    public Instructor? Instructor { get; set; }

    public new string Email
    {
        get => base.Email!;
        set => base.Email = value;
    }
    public new string PhoneNumber
    {
        get => base.PhoneNumber!;
        set => base.PhoneNumber = value;
    }

    public int CalculateAge()
    {
        if (!DateOfBirth.HasValue)
            return 0;
        DateOnly today = DateOnly.FromDateTime(DateTime.Today);
        int age = today.Year - DateOfBirth.Value.Year;
        if (DateOfBirth.Value > today.AddYears(-age))
            age--;
        return age;
    }
}

public enum UserRole
{
    Admin,
    Instructor,
    Student
}