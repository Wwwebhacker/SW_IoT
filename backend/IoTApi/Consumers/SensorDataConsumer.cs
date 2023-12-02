using IoTApi.Models;
using IoTApi.Services;
using System.Text;
using System.Text.Json;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace IoTApi.Consumers
{
    public class SensorDataConsumer : BackgroundService
    {

        private MqttClient mqttClient;
        private readonly SensorDataService sensorDataService;
        private readonly IConfiguration config;

        public SensorDataConsumer(SensorDataService sensorDataService, IConfiguration config)
        {
            this.sensorDataService = sensorDataService;
            this.config = config;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            await Task.Delay(5000);

            string address = config["MQTT:Address"];
            int port = int.Parse(config["MQTT:Port"]);

            mqttClient = new MqttClient(address, port, false, MqttSslProtocols.None, null, null);

            mqttClient.MqttMsgPublishReceived += MqttClient_MqttMsgPublishReceived;

            mqttClient.Connect(Guid.NewGuid().ToString());

            string[] topics = { "TEMPERATURE", "HUMIDITY", "LIGHT", "SOUND", "MOTION" };
            byte[] qosLevels = new byte[topics.Length];
            for (int i = 0; i < qosLevels.Length; i++)
            {
                qosLevels[i] = MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE;
            }
            mqttClient.Subscribe(topics, qosLevels);

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }

        private async void MqttClient_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            string message = Encoding.UTF8.GetString(e.Message);
            SensorDataMessage sensorDataMessage = JsonSerializer.Deserialize<SensorDataMessage>(message);
            if (sensorDataMessage == null) { return; }

            Sensor sensor = new Sensor { Id = sensorDataMessage.sensor_id.ToString(), Type = MessageSensorTypeToSensorType(sensorDataMessage.sensor_type) };
            SensorData sensorData = new SensorData
            {
                Sensor = sensor,
                Value = sensorDataMessage.value,
                DateTime = DateTime.Parse(sensorDataMessage.timestamp)
            };
            await sensorDataService.createAsync(sensorData);
        }

        private static string MessageSensorTypeToSensorType(string type)
        {
            Dictionary<string, string> types = new Dictionary<string, string>
            {
                { "temperature", SensorType.Temp },
                { "humidity", SensorType.Humidity },
                { "light_intensity", SensorType.Light },
                { "sound_level", SensorType.Sound },
                { "motion_detected", SensorType.Motion },
            };

            return types.GetValueOrDefault(type, "");
        }



    }
}
