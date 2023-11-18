namespace IoTApi.Models
{
    public class Sensor
    {
        public string Id { get; set; }
        public string Type { get; set; }
    }

    public class SensorType
    {
        public static readonly string Temp = "Temp";
        public static readonly string Sound = "Sound";
        public static readonly string Humidity = "Humidity";
        public static readonly string Motion = "Motion";
        public static readonly string Light = "Light";
    }
}
