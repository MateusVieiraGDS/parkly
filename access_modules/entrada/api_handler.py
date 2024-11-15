import requests
import threading

class ApiHandler:
    def __init__(self):
        self.lock = threading.Lock()

    def send_image(self, image_path):
        if not self.lock.acquire(blocking=False):
            print("Aguardando finalização do processo anterior.")
            return None

        try:
            url = "http://localhost/api/checkin"
            files = {'image': open(image_path, 'rb')}
            response = requests.post(url, files=files)
            if response.status_code == 201:
                data = response.json()
                print("Resposta do servidor:", data)
                return data
            else:
                print("Erro na requisição:", response.status_code)
                return None
        except Exception as e:
            print("Erro ao fazer a requisição:", e)
            return None
        finally:
            self.lock.release()
