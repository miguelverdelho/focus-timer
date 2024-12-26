using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace focus_timer_dotnet_api.Data.Models
{
    public class Time
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        [JsonIgnore]
        public string UserId { get; set; } = null!;
        public string ActivityName { get; set; } = null!;
        public DateOnly Date { get; set; }
        public long TimeSpent { get; set; }
    }

    public static class TimerConstants
    {
        public static readonly List<Time> DefaultTimerTypes =
        [
            new Time { ActivityName = "Work", TimeSpent = 0, Date = DateOnly.FromDateTime(DateTime.Today) },
            new Time { ActivityName = "Gaming", TimeSpent = 0, Date = DateOnly.FromDateTime(DateTime.Today) },
            new Time { ActivityName = "Studying", TimeSpent = 0, Date = DateOnly.FromDateTime(DateTime.Today) },
            new Time { ActivityName = "Coding", TimeSpent = 0, Date = DateOnly.FromDateTime(DateTime.Today) },
        ];
    }
}
