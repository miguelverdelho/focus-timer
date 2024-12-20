using MongoDB.Driver;
using focus_timer_dotnet_api.Settings;
using focus_timer_dotnet_api.Data.Interfaces;
using focus_timer_dotnet_api.Data.Models;
using MongoDB.Bson;

namespace focus_timer_dotnet_api.Data.Implementations
{

    public class MongoDbService : IMongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IMongoClient mongoClient, IConfiguration configuration)
        {
            var settings = configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
            _database = mongoClient.GetDatabase(settings!.DatabaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }

        public async Task<User?> DoesUserExistInTimesAsync(string userId)
        {            
            var collection = GetCollection<User>("users"); // 'times' collection contains entries of type 'Time'

            // Find if any 'Time' entry contains the specified 'userId' in its list of 'Times'
            var user = await collection.Find(t => t.Id == userId).FirstOrDefaultAsync();
            return user;
        }

        public async Task<User> CreateUserWithTimeAsync(User user)
        {
            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Create a new Time entry for today
            var timeEntry = new Time
            {
                Date = today,
                ElapsedTimes = new List<ElapsedTime>(), // Initialize empty if no elapsed times
                Id = ObjectId.GenerateNewId().ToString(), // Generate a new ObjectId
            };

            // Add the Time entry to the user
            user.Times.Add(timeEntry);

            // Get the collection for users
            var collection = GetCollection<User>("users"); // Replace "users" with the correct collection name

            // Insert the user into the collection
            await collection.InsertOneAsync(user);

            return user;
        }
    }
}
