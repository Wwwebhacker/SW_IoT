using IoTApi.Models;
using MongoDB.Driver;

namespace IoTApi.Data
{
    public class DataAccess
    {
        private readonly MongoClient mongoClient;
        private readonly IMongoDatabase db;
        public IMongoCollection<SensorData> sensorDataCollection { get; }
        public IMongoCollection<Sensor> sensorCollection { get; }


        public DataAccess(IConfiguration config)
        {
            mongoClient = new MongoClient(config["MongoDB:ConnectionString"]);
            db = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            db.DropCollection("sensors_data");
            db.DropCollection("sensors");
            sensorDataCollection = db.GetCollection<SensorData>("sensors_data");
            sensorCollection = db.GetCollection<Sensor>("sensors");
        }
    }
}
