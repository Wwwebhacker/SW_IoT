
using IoTApi.Models;
using IoTApi.Services;
using Microsoft.AspNetCore.Mvc;

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

            fakeData();
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
        public async Task<List<SensorData>> GetSensorData()
        {
            return await sensorDataService.GetAsync();
        }
    }
}
