import paho.mqtt.client as mqtt
import json
import argparse
from sensor import Sensor  


parser = argparse.ArgumentParser()
parser.add_argument("--sensor_nr", type=int, help="sensor nr")
args = parser.parse_args()



sensor_nr = args.sensor_nr
mqttBroker = "localhost"

with open("sensors.json", "r") as file:
    loaded_data = json.load(file)
    
sensor_json = loaded_data["Sensors"][sensor_nr]

sensor_type = sensor_json["type"]
sensor_ide = sensor_json["id"]

sensor = Sensor(sensor_type, sensor_ide, mqttBroker)
sensor.init_client()
sensor.connect_client()

match sensor_type:
    case "temperature":
        sensor.set_temp(sensor_json["min_value"], sensor_json["max_value"])
    case "humidity":
        sensor.set_humi(sensor_json["min_value"], sensor_json["max_value"])
    case "light_intensity":
        sensor.set_light(sensor_json["min_value"], sensor_json["max_value"])
    case "sound_level":
        sensor.set_sound(sensor_json["min_value"], sensor_json["max_value"])
    case "motion_detected":
        sensor.set_motion(sensor_json["value"])
        
sensor.set_sending_frequency(sensor_json["frequency"])

try:
    while True:
        match sensor_type:
            case "temperature":
                sensor.send_data("TEMPERATURE", sensor.generate_data())
            case "humidity":
                sensor.send_data("HUMIDITY", sensor.generate_data())
            case "light_intensity":
                sensor.send_data("LIGHT", sensor.generate_data())
            case "sound_level":
                sensor.send_data("SOUND", sensor.generate_data())
            case "motion_detected":
                sensor.send_data("MOTION", sensor.generate_data())
        sensor.wait_time()
        # sensor.send_data("TEST", sensor.generate_data())
        

except KeyboardInterrupt:
    sensor.disconnect_client()
