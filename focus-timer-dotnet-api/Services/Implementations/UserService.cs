using focus_timer_dotnet_api.Data.Implementations;
using focus_timer_dotnet_api.Data.Models;
using focus_timer_dotnet_api.Service.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;

namespace focus_timer_dotnet_api.Service
{
    public class UserService : IUserService
    {
        private readonly MongoDbService _mongoDbService;

        public UserService(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        public async Task<User?> ValidateUser(User user)
        {
            if (user.Id == null || user.Email == null || user.Name == null) return null;

            // check is user in DB if not create
            var existingUser = _mongoDbService.DoesUserExistAsync(user.Id).Result;

            if (existingUser == null) {
                existingUser = await _mongoDbService.CreateUserAsync(user);
            }            

            return existingUser ?? null;
        }

        public async Task<List<Time>> GetUserDailyTimes(User user){
             if (user.Id == null || user.Email == null || user.Name == null) return null;

             return await _mongoDbService.GetUserDailyTimes(user);
        }

        
    }
}
