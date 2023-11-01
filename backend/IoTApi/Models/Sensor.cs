using MongoDB.Bson.Serialization.Attributes;

namespace IoTApi.Models
{
    public class Sensor
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Type { get; set; }
    }

    public class SensorType
    {
        public static readonly string Temp = "Temp";
        public static readonly string Sound = "Sound";
        public static readonly string Humidity = "Humidity";
        public static readonly string Motion = "Motion";
    }
}
