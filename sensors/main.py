import multiprocessing
import os
import time
from sensor import Sensor  

def run_producer(sensor_nr):
    os.system(f"python producer.py --sensor_nr {sensor_nr}")

if __name__ == "__main__":
    processes = []

    for i in range(20):
        process = multiprocessing.Process(target=run_producer,args=(i,))
        processes.append(process)
        process.start()

    for process in processes:
        process.join()
        
