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

        public async Task<User> CreateUserAsync(User user)
        {           
            // Get the collection for users
            var collection = GetCollection<User>("users");

            // Insert the user into the collection
            await collection.InsertOneAsync(user);

            return user;
        }

        public async Task<List<Time>> GetUserDailyTimes(User user)
        {
            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Get the collection for users
            var collection = GetCollection<Time>("times");

            // Get user with same Id
            var userTimes = await collection.Find(t => t.UserId == user.Id && t.Date == today).ToListAsync();

            if (userTimes.Count > 0) {
                return userTimes;
            }

            var timeEntries = await CreateTimeEntriesAsync(user.Id!);

            // Add the Time entry to the user
            collection.InsertMany(timeEntries);

            return timeEntries;
        }

        public async Task<List<Time>> CreateTimeEntriesAsync(string userId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            // Get the collection for Time
            var timeCollection = GetCollection<Time>("times");

            // Find the user's latest Time entries
            var latestTimes = await timeCollection
                .Find(t => t.UserId == userId)  // Filter by the userId
                .SortByDescending(t => t.Date) // Sort by Date in descending order (most recent first)
                //.Limit(1)                      // Only get the most recent Time entry
                .ToListAsync();

            // Get the latest date from the most recent time entry
            var latestDate = latestTimes?.FirstOrDefault()?.Date;

            List<Time> timeEntries;

            if (latestDate.HasValue && latestDate.Value < today)
            {
                // If the latest entry is from a previous day, replicate its activities for today
                var timesToReplicate = latestTimes.Where(time => time.Date == latestDate.Value).ToList();

                // Create new time entries for today with the same activity names but reset TimeSpent to 0
                timeEntries = timesToReplicate.Select(time => new Time
                {
                    UserId = userId,          // Reference to the user
                    ActivityName = time.ActivityName,  // Copy activity name
                    Date = today,             // Set today's date
                    TimeSpent = 0             // Reset TimeSpent
                }).ToList();
            }
            else
            {
                // If there is no previous day to replicate, use default timer list (you can define this)
                timeEntries = TimerConstants.DefaultTimerTypes.Select(defaultTimer => new Time
                {
                    UserId = userId,
                    ActivityName = defaultTimer.ActivityName,  // Assuming DefaultTimerTypes has ActivityNames
                    Date = today,
                    TimeSpent = 0
                }).ToList();
            }

            // Return the list of new Time entries
            return timeEntries;
        }

        public async Task<Time> UpdateUserTime(string userId, Time time)
        {
            // Get the collection for Time
            var timeCollection = GetCollection<Time>("times");

            // Find the existing Time entry for the user with the same ActivityName and Date
            var existingTime = await timeCollection
                .Find(t => t.UserId == userId && t.ActivityName == time.ActivityName && t.Date == time.Date)
                .FirstOrDefaultAsync();

            // If the time entry does not exist, return null (or handle as needed)
            if (existingTime == null)
            {
                return null;
            }

            // Update the TimeSpent value in the existing Time entry
            var updateDefinition = Builders<Time>.Update.Set(t => t.TimeSpent, time.TimeSpent);

            // Perform the update operation
            await timeCollection.UpdateOneAsync(
                t => t.UserId == userId && t.ActivityName == time.ActivityName && t.Date == time.Date,
                updateDefinition
            );

            // Return the updated Time entry (this will reflect the new TimeSpent value)
            existingTime.TimeSpent = time.TimeSpent;
            return existingTime;
        }


    }
}
