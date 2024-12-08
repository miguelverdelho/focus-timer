using MongoDB.Driver;
using focus_timer_dotnet_api.Settings;

namespace focus_timer_dotnet_api.Service
{

    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IMongoClient mongoClient, IConfiguration configuration)
        {
            var settings = configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
            _database = mongoClient.GetDatabase(settings.DatabaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }
    }
}
