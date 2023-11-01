import paho.mqtt.client as mqtt
from random import randrange, uniform
import time
from sensor import Sensor  

mqttBroker = "localhost"

sensor = Sensor("temperature", 1, mqttBroker)
sensor.init_client()
sensor.connect_client()

try:
    while True:
        sensor.wait_time()
        sensor.send_data("TEMPERATURE", sensor.generate_data())

except KeyboardInterrupt:
    sensor.disconnect_client()
