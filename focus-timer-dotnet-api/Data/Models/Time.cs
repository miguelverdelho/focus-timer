using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace focus_timer_dotnet_api.Data.Models
{
    public class Time
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public DateOnly Date { get; set; }
        public List<ElapsedTime> ElapsedTimes { get; set; } = new();
    }

    public class ElapsedTime
    {
        [Required]
        public string ActivityName { get; set; } = null!;
        public TimeSpan TimeSpent { get; set; }
    }
}
