import cv2
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
        self.cancela_handler = CancelaHandler()
        self.running = True

    def start_camera(self):
        cap = cv2.VideoCapture(1)
        print("Pressione 'r' para capturar a imagem ou 'q' para sair.")

        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("Erro ao capturar a imagem.")
                break

            cv2.imshow("Pressione 'r' para capturar", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('r'):
                self.speech_handler.speak("o. .Oolá! Bem-vindo ao Parkly! Aguarde a impressão do seu ticket.")
                image_path = "captured_image.jpg"
                cv2.imwrite(image_path, frame)
                print("Imagem capturada.")
                threading.Thread(target=self.process_image, args=(image_path,), daemon=True).start()
            elif key == ord('q'):
                print("Saindo...")
                self.running = False

        cap.release()
        cv2.destroyAllWindows()

    def process_image(self, image_path):
        response_data = self.api_handler.send_image(image_path)
        if response_data:
            qr_data = response_data['ticket_number']
            qr_image_path = self.print_handler.generate_qrcode(qr_data)
            self.print_handler.print_qrcode(qr_image_path)
            self.cancela_handler.abrir_cancela()

if __name__ == "__main__":
    handler = MainHandler()
    handler.start_camera()
