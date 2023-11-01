import paho.mqtt.client as mqtt
import random
import time
import json
from datetime import datetime

class Sensor:
    def __init__(self, sensor_type, sensor_id, mqtt_broker):
        self.sensor_type = sensor_type
        self.sensor_id = sensor_id
        self.mqtt_broker = mqtt_broker
        self.time_period = 5.0
        self.temp = (20.0, 30.0)
        self.humi = (40.0, 60.0)
        self.light = (0, 1000)
        self.sound = (0, 100)
        self.motion = 0.5

    def generate_data(self):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        value = self.generate_sensor_value()
        data = {
            "sensor_type": self.sensor_type,
            "sensor_id": self.sensor_id,
            "value": value,
            "timestamp": timestamp
        }
        return data
    
    def wait_time(self):
        time.sleep(self.time_period)
        
    def set_temp(self, min: float, max: float):
        self.temp = (min, max)
        
    def set_humi(self, min: float, max: float):
        self.humi = (min, max)
        
    def set_light(self, min: int, max: int):
        self.light = (min, max)
        
    def set_sound(self, min: int, max: int):
        self.sound = (min, max)
        
    def set_motion(self, propablity_of_true: float):
        self.motion = propablity_of_true
    
    def set_sending_frequency(self, number_in_minute):
        self.time_period = 60.0 / number_in_minute
    
    def send_data(self, topic, sensor_data):
        value = sensor_data["value"]
        date = sensor_data["timestamp"]
        self.client.publish(topic, json.dumps(sensor_data))
        print(f"{date}. {self.client_name} sent {value} in {topic}")

    def generate_sensor_value(self):
        if self.sensor_type == "temperature":
            return random.uniform(self.temp[0], self.temp[1])
        elif self.sensor_type == "humidity":
            return random.uniform(self.humi[0], self.humi[1])
        elif self.sensor_type == "light_intensity":
            return random.randint(self.light[0], self.light[1])
        elif self.sensor_type == "sound_level":
            return random.randint(self.sound[0], self.sound[1])
        elif self.sensor_type == "motion_detected":
            probability = random.uniform(0.0, 1.0)
            if probability < self.motion:
                return True
            return False
        else:
            return -1
        
    def init_client(self):
        self.client_name = "Sensor"
        match self.sensor_type:
            case "temperature":
                self.client_name += "Temperature"
            case "humidity":
                self.client_name += "Humidity"
            case "light_intensity":
                self.client_name += "LightIntensity"
            case "sound_level":
                self.client_name += "Sound"
            case "motion_detected":
                self.client_name += "Motion"
            case _:
                self.client_name += "UnknowType"
        self.client_name += "-" + str(self.sensor_id)
        self.client = mqtt.Client(self.client_name)
        
    def connect_client(self):
        self.client.connect(self.mqtt_broker, 1883)
        
    def disconnect_client(self):
        self.client.disconnect()
    