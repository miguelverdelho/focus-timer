using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Serialization;

namespace focus_timer_dotnet_api.Data.Models
{
    public class User
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        [JsonIgnore]
        public List<Time> Times { get; set; } = [];
    }
}