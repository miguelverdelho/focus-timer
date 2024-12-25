using focus_timer_dotnet_api.Data.Models;

namespace focus_timer_dotnet_api.Service.Interfaces
{
    public interface IUserService : IBaseScoped
    {
        Task<User?> ValidateUser(User user);
        Task<Time?> GetUserDailyTimes(User user);
    }
}
