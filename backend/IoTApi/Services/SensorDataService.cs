using IoTApi.Data;
using IoTApi.Models;
using MongoDB.Driver;

namespace IoTApi.Services
{
    public class SensorDataService
    {

        private IMongoCollection<SensorData> sensorDataCollection;



        public SensorDataService(DataAccess access)
        {
            sensorDataCollection = access.sensorDataCollection;
        }

        public async Task<List<SensorData>> GetAsync() => await sensorDataCollection.Find(_ => true).ToListAsync();

        public async Task createAsync(SensorData sensorData) => await sensorDataCollection.InsertOneAsync(sensorData);
    }
}
