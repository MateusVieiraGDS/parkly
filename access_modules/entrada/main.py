import cv2
import os
import threading
from api_handler import ApiHandler
from print_handler import PrintHandler
from speech_handler import SpeechHandler
from cancela_handler import CancelaHandler

class MainHandler:
    def __init__(self):
        self.api_handler = ApiHandler()
        self.print_handler = PrintHandler()
        self.speech_handler = SpeechHandler()
        self.cancela_handler = CancelaHandler(porta='COM4', baudrate=9600)
        self.running = True

    def start_camera(self):
        cap = cv2.VideoCapture(0)
        print("Aguardando sinal de entrada ou pressione 'q' para sair.")

        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("Erro ao capturar a imagem.")
                break

            cv2.imshow("Aguardando entrada...", frame)

            # Verificar entrada serial do ESP8266
            if self.cancela_handler.verificar_entrada():
                self.processar_entrada(frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("Saindo...")
                self.running = False

        cap.release()
        cv2.destroyAllWindows()
        self.cancela_handler.fechar_conexao()

    def processar_entrada(self, frame):        
        image_dir = "temp"
        image_path = os.path.join(image_dir, "captured_image.jpg")
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)
        cv2.imwrite(image_path, frame)
        print("Imagem capturada.")
        threading.Thread(target=self.process_image, args=(image_path,), daemon=True).start()

    def process_image(self, image_path):
        response_data, success = self.api_handler.send_image(image_path)
        if response_data:
            self.speech_handler.speak(response_data['message'])
            if(success):                
                qr_data = response_data['ticket_code']
                qr_image_path = self.print_handler.generate_qrcode(qr_data)
                self.print_handler.print_qrcode(qr_image_path, response_data['ticket_number'])
                self.cancela_handler.abrir_cancela()

if __name__ == "__main__":
    handler = MainHandler()
    handler.start_camera()