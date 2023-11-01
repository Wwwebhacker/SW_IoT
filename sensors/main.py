import multiprocessing
import os
import time
from sensor import Sensor  

def run_producer():
    os.system("python producer.py")

if __name__ == "__main__":
    processes = []

    for _ in range(1):
        process = multiprocessing.Process(target=run_producer)
        processes.append(process)
        process.start()

    for process in processes:
        process.join()
        
