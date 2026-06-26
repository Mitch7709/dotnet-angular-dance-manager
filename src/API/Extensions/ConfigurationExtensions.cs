using API.Configuration;
using Infrastructure.Identity;
using Infrastructure.Image;

namespace API.Extensions;

public static class ConfigurationExtensions
{
    public static IServiceCollection AddCustomConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<DBOptions>()
            .Bind(configuration.GetSection("Database"))
            .ValidateDataAnnotations();

        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection("Jwt"))
            .ValidateDataAnnotations();

        services.AddOptions<CloudinarySettings>()
            .Bind(configuration.GetSection("Cloudinary"))
            .ValidateDataAnnotations();

        return services;
    }
}
