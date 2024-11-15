import pyttsx3
import threading

class SpeechHandler:
    def __init__(self):
        self.engine = pyttsx3.init()

    def speak(self, text):
        # Executa o TTS em uma thread separada
        threading.Thread(target=self._speak, args=(text,), daemon=True).start()

    def _speak(self, text):
        self.engine.say(text)
        self.engine.runAndWait()
