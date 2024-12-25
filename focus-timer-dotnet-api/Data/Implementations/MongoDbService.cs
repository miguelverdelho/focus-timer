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

        public async Task<User?> DoesUserExistAsync(string userId)
        {            
            var collection = GetCollection<User>("users"); // 'times' collection contains entries of type 'Time'

            // Find if any 'Time' entry contains the specified 'userId' in its list of 'Times'
            var user = await collection.Find(t => t.Id == userId).FirstOrDefaultAsync();
            return user;
        }

        public async Task<User> CreateUserWithTimeAsync(User user)
        {
            var timeEntry = CreateTimeEntry(user);

            // Add the Time entry to the user
            user.Times.Add(timeEntry);

            // Get the collection for users
            var collection = GetCollection<User>("users");

            // Insert the user into the collection
            await collection.InsertOneAsync(user);

            return user;
        }

        public async Task<Time?> GetUserDailyTimes(User user)
        {
            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Get the collection for users
            var collection = GetCollection<User>("users");

            // Get user with same Id
            var foundUser = await collection.Find(t => t.Id == user.Id).FirstOrDefaultAsync();

            if(foundUser == null)
            {
                return null;
            }

            var timeEntry = CreateTimeEntry(foundUser);

            // Add the Time entry to the user
            foundUser.Times.Add(timeEntry);

            return timeEntry;
        }

        public Time CreateTimeEntry(User user)
        {
            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            
             // Find the Time entry for today
            var timeEntry = user.Times.FirstOrDefault(t => t.Date == today);

            if(timeEntry == null)
            {
                // Is there a time for the day before today?
                var previousDay = today.AddDays(-1);
                var timeEntryDayBefore = user.Times.FirstOrDefault(t => t.Date == previousDay);

                // Create a new Time entry for today
                timeEntry = new Time
                {
                    Date = today,
                    ElapsedTimes = timeEntryDayBefore?.ElapsedTimes ?? TimerConstants.DefaultTimerTypes, // Initialize empty if no elapsed times
                    Id = ObjectId.GenerateNewId().ToString(), // Generate a new ObjectId
                };
            }

            //TODO put time entry in DB

            return timeEntry;
        }
    }
}
