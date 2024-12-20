using focus_timer_dotnet_api.Data.Models;
using focus_timer_dotnet_api.Service;
using focus_timer_dotnet_api.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace focus_timer_dotnet_api.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;

        public UserController(ILogger<UserController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpGet]
        [Route("login")]
        public async Task<IActionResult> LoginValidateUser()
        {
            var user = (User?)HttpContext.Items["User"];

            if (user != null && user.Id == null)
            {
                return BadRequest("Required claims are missing.");
            }

            _logger.LogInformation("Getting user");

            if((user = await _userService.ValidateUser(user!)) != null)
            {
                return Ok(user);
            }

            return BadRequest("Invalid User.");
        }

        [HttpGet]
        [Route("/times")]
        public async Task<IActionResult> GetUserTimes()
        {
            var user = (User?)HttpContext.Items["User"];
        }
    }
}
