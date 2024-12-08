using focus_timer_dotnet_api.Models;
using focus_timer_dotnet_api.Service;
using Microsoft.AspNetCore.Mvc;

namespace focus_timer_dotnet_api.Controllers
{
    [ApiController]
    [Route("api/times")]
    public class TimesContoller : ControllerBase
    {
        private readonly ILogger<TimesContoller> _logger;
        private readonly TimeService _timeService;

        public TimesContoller(ILogger<TimesContoller> logger, TimeService timeService)
        {
            _logger = logger;
            _timeService = timeService;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetTimes()
        {
            return Ok(await _timeService.GetTimes());
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddTime([FromBody] Time time){
            return Ok(await _timeService.AddTime(time));
        }
    }
}
