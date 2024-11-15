import os
import qrcode
import json
import win32print
import win32ui
from PIL import Image, ImageWin

class PrintHandler:
    def generate_qrcode(self, data):
        # Converte os dados para JSON e gera o QR Code
        json_data = json.dumps(data)
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L)
        qr.add_data(json_data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        qr_image_path = "qrcode.bmp"
        img.save(qr_image_path, "BMP")
        print("QR Code gerado.")
        return qr_image_path

    def print_qrcode(self, qr_image_path):
        try:
            # Nome da impressora (substitua pelo nome correto)
            printer_name = "EPSON09C9F7 (L375 Series) (Copiar 2)"

            # Abrir a imagem
            img = Image.open(qr_image_path)

            # Configurar a impressora
            hprinter = win32print.OpenPrinter(printer_name)
            hDC = win32ui.CreateDC()
            hDC.CreatePrinterDC(printer_name)
            hDC.StartDoc(qr_image_path)
            hDC.StartPage()

            # Definir escala da imagem
            scale_x = int(hDC.GetDeviceCaps(8) * 0.9)
            scale_y = int(hDC.GetDeviceCaps(10) * 0.9)

            # Desenhar a imagem na página
            dib = ImageWin.Dib(img)
            dib.draw(hDC.GetHandleOutput(), (0, 0, scale_x, scale_y))

            # Finalizar a impressão
            hDC.EndPage()
            hDC.EndDoc()
            hDC.DeleteDC()
            win32print.ClosePrinter(hprinter)

            print("QR Code enviado para a impressora com sucesso! 🖨️")
        except Exception as e:
            print("Erro ao enviar para o spooler:", e)
