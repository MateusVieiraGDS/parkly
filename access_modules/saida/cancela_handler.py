import serial
import time

class CancelaHandler:
    def __init__(self, porta='COM4', baudrate=115200):
        try:
            self.esp = serial.Serial(porta, baudrate, timeout=15)
            self.esp.rts = False
            self.esp.dtr = False
            time.sleep(2)  # Espera para estabilizar a conexão
            print("Conexão estabelecida com o ESP8266.")
        except Exception as e:
            print(f"Erro ao conectar na porta {porta}: {e}")
            self.esp = None

    def abrir_cancela(self):
        """
        Envia o comando para abrir a cancela e aguarda a confirmação de fechamento.
        """
        if not self.esp:
            print("Erro: Conexão com ESP8266 não estabelecida.")
            return

        print("Enviando comando para abrir a cancela...")
        self.esp.write(b'1\n')  # Envia o comando "1" para abrir a cancela

        # Aguardar a confirmação de fechamento
        while True:
            resposta = self._ler_serial()
            if resposta == "3":
                print("Cancela fechada. Continuando o programa.")
                break

    def fechar_conexao(self):
        """
        Fecha a conexão serial com o ESP8266.
        """
        if self.esp:
            self.esp.close()
            print("Conexão encerrada.")

    def _ler_serial(self):
        """
        Método auxiliar para ler dados da serial.
        """
        try:
            if self.esp.in_waiting > 0:
                dados = self.esp.readline().decode(errors='ignore').strip()
                print(f"Dados recebidos: {dados} (Tamanho: {len(dados)})")
                return dados
        except Exception as e:
            print(f"Erro ao ler da serial: {e}")
        return ""
