import cv2
import threading
from api_handler import ApiHandler
from speech_handler import SpeechHandler
from cancela_handler import CancelaHandler
import time

class QRCodeCheckoutHandler:
    def __init__(self):
        self.api_handler = ApiHandler()
        self.speech_handler = SpeechHandler()
        self.cancela_handler = CancelaHandler(porta='COM4', baudrate=9600)
        self.running = True
        self.processing = False  # Flag para evitar múltiplas leituras simultâneas
        self.qr_detector = cv2.QRCodeDetector()

    def start_camera(self):
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        print("Iniciando a leitura de QR Codes. Pressione 'q' para sair.")

        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("Erro ao capturar a imagem da câmera.")
                break

            try:
                # Detecta QR Code usando o QRCodeDetector do OpenCV
                qr_data, bbox, _ = self.qr_detector.detectAndDecode(frame)
                if qr_data and not self.processing:
                    self.processing = True
                    print(f"QR Code detectado: {qr_data}")

                    # Processa o QR Code em uma thread separada
                    threading.Thread(target=self.process_qrcode, args=(qr_data,), daemon=True).start()
            except cv2.error as e:
                print(f"Erro no OpenCV: {e}")

            # Exibe o frame da câmera
            cv2.imshow("Leitura de QR Codes", frame)

            # Sai do loop se pressionar 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("Saindo...")
                self.running = False
        cap.release()
        cv2.destroyAllWindows()
        self.cancela_handler.fechar_conexao()

    def process_qrcode(self, qr_data):
        """
        Processa o QR Code detectado e envia o comando para abrir a cancela.
        """
        try:
            response_data = self.api_handler.send_checkout(qr_data)
            if response_data:
                message = response_data.get("message", "Erro desconhecido.")
                if response_data.get("success", False):
                    self.speech_handler.speak(message)
                    self.cancela_handler.abrir_cancela()
                else:
                    self.speech_handler.speak(message)
                    time.sleep(3)
        except Exception as e:
            print(f"Erro ao processar QR Code: {e}")
        finally:
            # Libera o processamento para permitir novas leituras
            self.processing = False

if __name__ == "__main__":
    handler = QRCodeCheckoutHandler()
    handler.start_camera()
