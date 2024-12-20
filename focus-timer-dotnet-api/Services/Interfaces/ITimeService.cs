using focus_timer_dotnet_api.Data.Models;

namespace focus_timer_dotnet_api.Service.Interfaces
{
    public interface ITimeService : IBaseScoped
    {
        Task<List<Time>> GetTimes();
        Task<Time?> AddTime(Time time);
    }
}
