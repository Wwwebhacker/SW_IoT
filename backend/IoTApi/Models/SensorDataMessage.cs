namespace IoTApi.Models
{
    public record SensorDataMessage
    {
        public required string sensor_type { get; init; }
        public required int sensor_id { get; init; }

        public required double value { get; init; }
        public required string timestamp { get; init; }

    }
}
