using focus_timer_dotnet_api.Data.Models;
using focus_timer_dotnet_api.Service;
using focus_timer_dotnet_api.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace focus_timer_dotnet_api.Controllers
{
    [ApiController]
    [Route("api/times")]
    [Authorize]
    public class TimesContoller : ControllerBase
    {
        private readonly ILogger<TimesContoller> _logger;
        private readonly ITimeService _timeService;

        public TimesContoller(ILogger<TimesContoller> logger, ITimeService timeService)
        {
            _logger = logger;
            _timeService = timeService;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetTimes()
        {
            var user = (User?)HttpContext.Items["User"];

            if (user != null && user.Id == null)
            {
                return BadRequest("Required claims are missing.");
            }

            _logger.LogInformation("Getting times");
            return Ok(await _timeService.GetTimes());
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddTime([FromBody] Time time){
            _logger.LogInformation("Adding time");
            return Ok(await _timeService.AddTime(time));
        }
    }
}
