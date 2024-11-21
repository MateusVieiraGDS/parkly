import requests
import threading

class ApiHandler:
    def __init__(self):
        self.lock = threading.Lock()

    def send_image(self, image_path):
        if not self.lock.acquire(blocking=False):
            print("Aguardando finalização do processo anterior.")
            return None, False  # Retorna uma tupla indicando falha na aquisição do lock

        try:
            url = "http://localhost/api/checkin"
            headers = {'X-API-KEY': "wtrm87y2eez2Ulhq2ez2Ul3y2e98kc3KF"}
            with open(image_path, 'rb') as image_file:
                files = {'image': image_file}
                response = requests.post(url, files=files, headers=headers)

            if response.status_code == 201:
                data = response.json()
                print("Resposta do servidor:", data)
                success = True
                return data, success  # Retorna uma tupla
            elif response.status_code == 422:
                data = response.json()
                print("Erro de validação:", data)
                success = False
                return data, success  # Retorna uma tupla
            else:
                print("Erro na requisição:", response.status_code)
                return None, False  # Retorna uma tupla indicando erro
        except Exception as e:
            print("Erro ao fazer a requisição:", e)
            return None, False  # Retorna uma tupla indicando falha geral
        finally:
            self.lock.release()
