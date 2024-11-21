import os
import qrcode
import json
import win32print
import win32ui
from PIL import Image, ImageDraw, ImageFont, ImageWin

class PrintHandler:
    def generate_qrcode(self, data):
        """
        Gera um QR Code a partir dos dados fornecidos e salva como uma imagem BMP.
        """
        json_data = json.dumps(data)
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L)
        qr.add_data(json_data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        image_dir = "temp"
        qr_image_path = os.path.join(image_dir, "qrcode.bmp")
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)

        img.save(qr_image_path, "BMP")
        print("QR Code gerado.")
        return qr_image_path

    def print_qrcode(self, qr_image_path, ticket_number):
        """
        Imprime o QR Code e adiciona o texto "Bem-vindo" abaixo da imagem,
        mantendo a proporção original e centralizando na página.
        """
        try:
            printer_name = "EPSON09C9F7 (L375 Series) (Copiar 2)"

            # Abrir a imagem do QR Code
            img = Image.open(qr_image_path)

            # Definir o texto
            text = f"Bem-vindo ao Parkly!\nNúmero do Ticket: {ticket_number}"

            # Carregar a fonte
            try:
                font = ImageFont.truetype("arial.ttf", 20)
            except IOError:
                font = ImageFont.load_default()

            # Criar objeto de desenho e calcular o tamanho do texto
            draw = ImageDraw.Draw(img)
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]

            # Criar imagem final com texto
            width, height = img.size
            total_height = height + text_height + 20
            final_img = Image.new("RGB", (width, total_height), "white")
            final_img.paste(img, (0, 0))

            # Desenhar o texto abaixo do QR Code
            text_x = (width - text_width) // 2
            text_y = height + 10
            draw = ImageDraw.Draw(final_img)
            draw.text((text_x, text_y), text, fill="black", font=font)

            # Salvar a imagem final
            image_dir = "temp"
            final_image_path = os.path.join(image_dir, "qrcode_with_text.bmp")
            if not os.path.exists(image_dir):
                os.makedirs(image_dir)

            final_img.save(final_image_path, "BMP")

            # Abrir a imagem no visualizador padrão do sistema
            os.startfile(final_image_path)
            print("Imagem aberta no visualizador de imagens.")

            # Configurar a impressora e enviar a imagem para impressão
            hprinter = win32print.OpenPrinter(printer_name)
            hDC = win32ui.CreateDC()
            hDC.CreatePrinterDC(printer_name)
            hDC.StartDoc(final_image_path)
            hDC.StartPage()

            # Definir o tamanho desejado para impressão (mantendo proporção)
            print_width = int(width * 0.8)  # Reduz o tamanho para 50%
            print_height = int(total_height * 0.8)
            pos_x = (hDC.GetDeviceCaps(8) - print_width) // 2  # Centraliza horizontalmente
            pos_y = (hDC.GetDeviceCaps(10) - print_height) // 2  # Centraliza verticalmente

            # Desenhar a imagem na posição calculada
            dib = ImageWin.Dib(Image.open(final_image_path))
            dib.draw(hDC.GetHandleOutput(), (pos_x, pos_y, pos_x + print_width, pos_y + print_height))

            # Finalizar a impressão
            hDC.EndPage()
            hDC.EndDoc()
            hDC.DeleteDC()
            win32print.ClosePrinter(hprinter)

            print("QR Code e texto enviados para a impressora com sucesso! 🖨️")
        except Exception as e:
            print("Erro ao enviar para o spooler:", e)
