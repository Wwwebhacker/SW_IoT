using IoTApi.Data;
using IoTApi.Models;
using MongoDB.Driver;

namespace IoTApi.Services
{
    public class SensorService
    {
        private IMongoCollection<Sensor> sensorCollection;

        public SensorService(DataAccess access)
        {
            sensorCollection = access.sensorCollection;
        }


        public async Task<List<Sensor>> GetAsync() => await sensorCollection.Find(_ => true).ToListAsync();

        public async Task createAsync(Sensor sensor) => await sensorCollection.InsertOneAsync(sensor);

    }
}
