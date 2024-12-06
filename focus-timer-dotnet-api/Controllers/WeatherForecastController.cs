using Microsoft.AspNetCore.Mvc;

namespace focus_timer_dotnet_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TimesContoller : ControllerBase
    {

        private readonly ILogger<TimesContoller> _logger;

        public TimesContoller(ILogger<TimesContoller> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetTimes")]
        public IEnumerable<object> Get()
        {
            return [];
        }
    }
}
