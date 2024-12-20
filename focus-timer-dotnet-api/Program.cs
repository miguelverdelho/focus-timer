using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using focus_timer_dotnet_api.Data.Implementations;
using focus_timer_dotnet_api.Middleware;
using focus_timer_dotnet_api.Service.Interfaces;
using focus_timer_dotnet_api.Service;
using focus_timer_dotnet_api.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var settings = builder.Configuration.GetSection("GoogleAuthSettings").Get<GoogleAuthSettings>();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "accounts.google.com", // Replace if necessary
            ValidAudience = settings!.GoogleClientId,   // Your Google Client ID
            IssuerSigningKeyResolver = (token, securityToken, kid, validationParameters) =>
            {
                // Fetch Google's public keys dynamically
                var client = new HttpClient();
                var response = client.GetStringAsync("https://www.googleapis.com/oauth2/v3/certs").Result;
                var keys = new JsonWebKeySet(response);
                return keys.Keys;
            },
            NameClaimType = "name",
            RoleClaimType = "role",            
            SaveSigninToken = true,
           
        };
    });


//Mongo DB Services
// Bind MongoDB settings from configuration
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Register MongoClient with DI
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IConfiguration>().GetSection("MongoDbSettings").Get<MongoDbSettings>();
    return new MongoClient(settings!.ConnectionString);
});

// Register MongoDbService
builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddSingleton<TimeService>();

// Register interfaces
builder.Services.Scan(scan => scan
    .FromAssemblyOf<IBaseSingleton>()
    .AddClasses(classes => classes.AssignableTo<IBaseSingleton>())
    .AsImplementedInterfaces()
    .WithSingletonLifetime());

builder.Services.Scan(scan => scan
    .FromAssemblyOf<IBaseScoped>()
    .AddClasses(classes => classes.AssignableTo<IBaseScoped>())
    .AsImplementedInterfaces()
    .WithScopedLifetime());

var app = builder.Build();

app.UseMiddleware<HttpClaimsMiddleware>();
// Test MongoDB connection (optional)
using (var scope = app.Services.CreateScope())
{
    var mongoDbService = scope.ServiceProvider.GetRequiredService<MongoDbService>();
    Console.WriteLine("MongoDB Service Initialized!");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Use(async (context, next) =>
{
    if (context.Request.Path.Value == "/")
    {
        context.Response.Redirect("/swagger");
    }
    else
    {
        await next();
    }
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseCors("CorsPolicy");

app.Run();
