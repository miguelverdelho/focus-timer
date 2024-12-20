using focus_timer_dotnet_api.Data.Models;
using System.Security.Claims;

namespace focus_timer_dotnet_api.Middleware
{
    public class HttpClaimsMiddleware
    {
        private readonly RequestDelegate _next;

        public HttpClaimsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var claimsIdentity = context.User.Identity as ClaimsIdentity;

                // Extract claims
                var emailClaim = claimsIdentity?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
                var subClaim = claimsIdentity?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
                var nameClaim = claimsIdentity?.Claims.FirstOrDefault(x => x.Type == "name")?.Value;

                context.Items["User"] = new User { 
                    Email = emailClaim!,
                    Id = subClaim!,
                    Name = nameClaim!
                };

            }

            await _next(context);
        }
    }
}
