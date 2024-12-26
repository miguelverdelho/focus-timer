using focus_timer_dotnet_api.Data.Models;
using MongoDB.Driver;

namespace focus_timer_dotnet_api.Data.Interfaces
{
    public interface IMongoDbService
    {
        IMongoCollection<T> GetCollection<T>(string collectionName);
        Task<List<Time>> GetUserDailyTimes(User user);
        Task<Time> UpdateUserTime(string userId, Time time);
    }
}
