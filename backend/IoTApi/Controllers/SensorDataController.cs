
using IoTApi.Models;
using IoTApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace IoTApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class SensorDataController : Controller
    {
        private readonly SensorDataService sensorDataService;
        private readonly SensorService sensorService;

        public SensorDataController(SensorDataService sensorDataService, SensorService sensorService)
        {
            this.sensorDataService = sensorDataService;
            this.sensorService = sensorService;

            //fakeData();
        }

        private async void fakeData()
        {
            var types = new string[] { SensorType.Temp, SensorType.Humidity, SensorType.Sound, SensorType.Motion };

            for (int i = 0; i < 10; i++)
            {
                await sensorService.createAsync(new Sensor
                {
                    Type = types[Random.Shared.Next(types.Length)]
                });
            }
            var sensors = sensorService.GetAsync().Result.ToArray();

            for (int i = 0; i < 10; i++)
            {
                await sensorDataService.createAsync(new SensorData
                {
                    DateTime = DateTime.Now,
                    Value = Random.Shared.NextDouble() * i,
                    Sensor = sensors[Random.Shared.Next(sensors.Length)]
                });
            }
        }

        [HttpGet(Name = "GetSensorData")]
        public async Task<List<SensorData>> GetSensorData(
            string? sensorType = null,
            string? sensorId = null,
            DateTime? from = null,
            DateTime? to = null,
            string sortBy = "Date",
            string sortOrder = "asc"
        )
        {
            var filterBuilder = Builders<SensorData>.Filter;

            var filter = filterBuilder.Empty;
            if (!string.IsNullOrEmpty(sensorType))
            {
                filter &= filterBuilder.Eq(x => x.Sensor.Type, sensorType);
            }

            if (from.HasValue)
            {
                filter &= filterBuilder.Gte(x => x.DateTime, from);
            }

            if (to.HasValue)
            {
                filter &= filterBuilder.Lte(x => x.DateTime, to);
            }

            if (!string.IsNullOrEmpty(sensorId))
            {
                filter &= filterBuilder.Eq(x => x.Sensor.Id, sensorId);
            }

            var sortBuilder = Builders<SensorData>.Sort;

            SortDefinition<SensorData> sortDefinition = sortOrder.ToLower() == "desc"
            ? sortBuilder.Descending(sortBy)
            : sortBuilder.Ascending(sortBy);

            return sensorDataService.sensorDataCollection.Find(filter).Sort(sortDefinition).ToList();
        }
    }
}
