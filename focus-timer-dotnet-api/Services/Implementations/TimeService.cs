
using focus_timer_dotnet_api.Data.Implementations;
using focus_timer_dotnet_api.Data.Models;
using focus_timer_dotnet_api.Service.Interfaces;
using MongoDB.Driver;

namespace focus_timer_dotnet_api.Service
{
    public class TimeService : ITimeService
    {
        private readonly MongoDbService _mongoDbService; 

        public TimeService(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        public async Task<List<Time>> GetTimes()
        {
            var collection = await _mongoDbService.GetCollection<Time>("times").Find(_ => true).ToListAsync();            

            return collection;
        }

        public async Task<Time?> AddTime(Time time)
        {
            var collection = _mongoDbService.GetCollection<Time>("times");

            await collection.InsertOneAsync(time);

            return time;
        }
    }
}
