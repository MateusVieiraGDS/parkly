import serial
import time
import os

class CancelaHandler:
    def __init__(self, porta='COM4', baudrate=115200):
        try:
            os.system(f"mode {porta} baud={baudrate}")
            
            self.esp = serial.Serial(porta, baudrate, timeout=15)
            self.esp.rts = False
            self.esp.dtr = False
            time.sleep(2)  # Espera para estabilizar a conexão
            print("Conexão estabelecida com o ESP8266.")
        except Exception as e:
            print(f"Erro ao conectar na porta {porta}: {e}")
            self.esp = None

    def abrir_cancela(self):
        if not self.esp:
            print("Erro: Conexão com ESP8266 não estabelecida.")
            return

        print("Enviando comando para abrir a cancela...")
        self.esp.write(b'1\n')

        while True:
            resposta = self._ler_serial()
            if resposta == "3":
                print("Cancela fechada. Continuando o programa.")
                break

    def verificar_entrada(self):
        if not self.esp:
            print("Erro: Conexão com ESP8266 não estabelecida.")
            return False

        resposta = self._ler_serial()
        if resposta == "2":
            print("Sinal de entrada detectado.")
            return True
        return False

    def fechar_conexao(self):
        if self.esp:
            try:
                print("Encerrando conexão.....")
                
                # Ativar DTR para resetar e depois desativar
                self.esp.dtr = True
                self.esp.rts = True
                time.sleep(0.5)
                
                self.esp.dtr = False
                self.esp.rts = False
                
                # Fechar a conexão
                self.esp.close()
                del self.esp
                
                # Aguarda o sistema operacional liberar a porta
                time.sleep(2)

                print("Conexão encerrada e porta liberada.")
            except Exception as e:
                print(f"Erro ao encerrar conexão: {e}")

    def _ler_serial(self):
        try:
            if self.esp.in_waiting > 0:
                dados = self.esp.readline().decode(errors='ignore').strip()
                print(f"Dados recebidos: {dados} (Tamanho: {len(dados)})")
                return dados
        except Exception as e:
            print(f"Erro ao ler da serial: {e}")
        return ""
