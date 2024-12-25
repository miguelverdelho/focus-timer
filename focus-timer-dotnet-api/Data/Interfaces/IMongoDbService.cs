using focus_timer_dotnet_api.Data.Models;
using MongoDB.Driver;

namespace focus_timer_dotnet_api.Data.Interfaces
{
    public interface IMongoDbService
    {
        IMongoCollection<T> GetCollection<T>(string collectionName);
        Task<Time?> GetUserDailyTimes(User user);
    }
}
