using API.Configuration;
using API.Extensions;
using Infrastructure.Database;
using Infrastructure.Image;
using Microsoft.EntityFrameworkCore;

namespace API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddEndpointsApiExplorer()
                        .AddOpenApi()
                        .AddAntiforgery()
                        .ConfigureHttpJsonOptions(options =>
                        {
                            options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
                        })
                        .AddHttpContextAccessor()
                        .AddCustomConfiguration(builder.Configuration)
                        .AddDatabase()
                        .AddSecurity(builder.Configuration)
                        .AddDepedencyInjection();
                        // .Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

        var app = builder.Build();

        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        //dbContext.Database.Migrate();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection()
            .UseCors(Security.CorsPolicy)
            .UseAuthentication()
            .UseAuthorization()
            .UseAntiforgery()
            .UseDatabase()
            .UseMinimalApiEndpoints();

        app.Run();
    }
}
