using MongoDB.Bson.Serialization.Attributes;

namespace IoTApi.Models
{
    public class SensorData
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public double Value { get; set; }
        public DateTime DateTime { get; set; }

        public Sensor Sensor { get; set; }
    }
}
