using API.Modules;
using System.Reflection;

namespace API.Extensions;

public static class ApiEndpointsExtension
{
    public static IApplicationBuilder UseMinimalApiEndpoints(this IApplicationBuilder app)
    {
        var moduleTypes = Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => typeof(IModule).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract)
            .ToList();

        if (app is not WebApplication webApp)
            throw new InvalidOperationException("UseMinimalApiEndpoints must be called on a WebApplication instance.");

        foreach (var type in moduleTypes)
        {
            IModule? module = Activator.CreateInstance(type) as IModule;
            RouteGroupBuilder? group = webApp.MapGroup("/api");
            module?.MapEndpoints(group);
        }

        return app;
    }
}
