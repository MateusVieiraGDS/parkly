import requests
import threading

class ApiHandler:
    def __init__(self):
        self.lock = threading.Lock()

    def send_checkout(self, qr_data):
        if not self.lock.acquire(blocking=False):
            print("Aguardando finalização do processo anterior.")
            return None

        try:
            url = "http://localhost/api/checkout"
            headers = {'X-API-KEY': "wtrm87y2eez2Ulhq2ez2Ul3y2e98kc3KF"}
            payload = {"data": qr_data}
            response = requests.post(url, json=payload, headers=headers)

            if response.status_code in [200, 422]:
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
