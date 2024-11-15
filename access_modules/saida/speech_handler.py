import pyttsx3
import threading

class SpeechHandler:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.lock = threading.Lock()

    def speak(self, text):
        self.engine.say(text)
        self.engine.runAndWait()

