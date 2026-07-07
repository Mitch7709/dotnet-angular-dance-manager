using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Core.Models;

public class AppUser : IdentityUser, IEntity
{


    public AppUser(string email, string firstName, string lastName, string phoneNumber)
    {
        Email = email;
        UserName = email;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
    }

    public static class MaxLength
    {
        public const int FirstName = 50;
        public const int LastName = 50;
        public const int PhoneNumber = 20;
        public const int Email = 100;
        public const int ImageUrl = 200;
    }

    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string? ImageUrl { get; set; }

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
}

public enum UserRole
{
    Admin,
    Instructor,
    Student
}