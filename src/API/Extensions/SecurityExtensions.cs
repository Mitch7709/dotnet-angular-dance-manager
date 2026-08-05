using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Extensions;

public static class Security
{
    public const string CorsPolicy = "OpenCorsPolicy";
    public const string AdminPolicy = "Admin";
    public const string InstructorPolicy = "Instructor";
    public const string NonStudentPolicy = "NonStudent";
}

public static class SecurityExtensions
{
    public static IServiceCollection AddSecurity(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtOptions = new JwtOptions();
        configuration.GetSection("Jwt").Bind(jwtOptions);

        services.AddAuthentication(o =>
        {
            o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidAudience = jwtOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key))
            };
        });

        services.AddAuthorizationBuilder()
            .AddPolicy(Security.AdminPolicy, policy =>
            {
                policy.RequireRole("Admin");
            })
            .AddPolicy(Security.InstructorPolicy, policy =>
            {
                policy.RequireRole("Instructor");
            })
            .AddPolicy(Security.NonStudentPolicy, policy =>
            {
                policy.RequireRole("Admin", "Instructor");
            });

        services.AddCors(policy =>
        {
            policy.AddPolicy(Security.CorsPolicy, opt =>
            {
                opt.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
            });
        });
        return services;
    }
}
