
using IoTApi.Models;
using IoTApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Globalization;
using System.Text;
using System.Text.Json;

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
        public async Task<IActionResult> GetSensorData(
            string? sensorType = null,
            string? sensorId = null,
            DateTime? from = null,
            DateTime? to = null,
            string sortBy = "DateTime",
            string sortOrder = "asc",
            string? outputFormat = null
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


            List<SensorData> sensorData = sensorDataService.sensorDataCollection.Find(filter).Sort(sortDefinition).ToList();


            if (string.IsNullOrEmpty(outputFormat))
            {
                return Ok(sensorData);
            }

            if (outputFormat.ToLower() == "csv")
            {
                return GenerateCsvResult(sensorData);
            }
            else if (outputFormat.ToLower() == "json")
            {
                return GenerateJsonResult(sensorData);
            }
            else
            {
                return BadRequest("Invalid output format. Supported formats: 'csv' or 'json'");
            }
        }
        private IActionResult GenerateJsonResult(List<SensorData> data)
        {
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            var stream = new MemoryStream(Encoding.UTF8.GetBytes(json));

            var fileContentResult = new FileStreamResult(stream, "application/json");
            fileContentResult.FileDownloadName = "sensor_data.json";

            return fileContentResult;
        }

        private IActionResult GenerateCsvResult(List<SensorData> data)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            var csv = new CsvHelper.CsvWriter(writer, CultureInfo.InvariantCulture);

            if (data.Any())
            {
                csv.WriteField("Id");
                csv.WriteField("Value");
                csv.WriteField("DateTime");
                csv.WriteField("Sensor.Id");
                csv.WriteField("Sensor.Type");
                csv.NextRecord();

                foreach (var sensorData in data)
                {
                    csv.WriteField(sensorData.Id);
                    csv.WriteField(sensorData.Value);
                    csv.WriteField(sensorData.DateTime);
                    csv.WriteField(sensorData.Sensor?.Id);
                    csv.WriteField(sensorData.Sensor?.Type);
                    csv.NextRecord();
                }
            }
            else
            {
                csv.WriteField("Id");
                csv.WriteField("Value");
                csv.WriteField("DateTime");
                csv.WriteField("Sensor.Id");
                csv.WriteField("Sensor.Type");
                csv.NextRecord();
            }

            writer.Flush();
            stream.Position = 0;

            var fileContentResult = new FileStreamResult(stream, "text/csv");
            fileContentResult.FileDownloadName = "sensor_data.csv";

            return fileContentResult;
        }
    }
}
