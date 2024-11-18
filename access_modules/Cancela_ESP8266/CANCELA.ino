/**
 * Controle de Cancela Automática com ESP8266
 *
 * Este código controla uma cancela automática utilizando um servo motor,
 * LEDs para indicação e um botão de entrada. Ele se comunica via porta serial
 * para receber comandos e enviar sinais de status para um script Python ou outra interface.
 *
 * - Sinal "1": Abrir cancela
 * - Sinal "2": Botão pressionado (Entrada detectada)
 * - Sinal "3": Cancela fechada
 *
 * Conexões:
 * - Servo Motor:
 *   - Sinal → GPIO4 (D2)
 * - Botão:
 *   - Um terminal → GPIO0 (D3)
 *   - Outro terminal → GND
 * - LED Vermelho:
 *   - Anodo (perna maior) → GPIO14 (D5)
 *   - Catodo (perna menor) → GND
 * - LED Verde:
 *   - Anodo (perna maior) → GPIO5 (D1)
 *   - Catodo (perna menor) → GND
 */

#include <Servo.h>

// Declaração dos pinos e variáveis
Servo myServo;
const int servoPin = 4;       // Pino do servo motor (GPIO4 / D2)
const int buttonPin = 0;      // Pino do botão (GPIO0 / D3)
const int posAberta = 195;    // Posição para abrir a cancela
const int posFechada = 0;     // Posição para fechar a cancela
const int ledVermelho = 14;   // Pino do LED vermelho (GPIO14 / D5)
const int ledVerde = 5;       // Pino do LED verde (GPIO5 / D1)
bool cancelaAberta = false;   // Estado da cancela (aberta ou fechada)

void setup() {
  // Inicialização da comunicação serial e do servo motor
  Serial.begin(9600);
  myServo.attach(servoPin);
  myServo.write(posFechada); // Inicia com a cancela fechada

  // Configuração dos pinos
  pinMode(buttonPin, INPUT_PULLUP);   // Configura o botão com pull-up interno
  pinMode(ledVermelho, OUTPUT);
  pinMode(ledVerde, OUTPUT);

  // Inicia com o LED vermelho aceso (cancela fechada)
  digitalWrite(ledVermelho, HIGH);
  digitalWrite(ledVerde, LOW);
}

void loop() {
  // Verifica se o botão foi pressionado
  if (digitalRead(buttonPin) == LOW && cancelaAberta == false) {
    Serial.println("2"); // Envia o sinal "2" para indicar entrada detectada
    delay(500);          // Debounce para evitar múltiplos sinais
  }

  // Verifica se há dados recebidos pela porta serial
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');

    // Se o comando for "1", abre a cancela
    if (cancelaAberta == false && comando == "1") {
      abrirCancela();
      delay(8000); // Aguarda 8 segundos antes de fechar
      fecharCancela();
    }
  }
}

// Função para abrir a cancela
void abrirCancela() {
  myServo.write(posAberta);        // Movimenta o servo para abrir a cancela
  cancelaAberta = true;
  digitalWrite(ledVermelho, LOW);  // Apaga o LED vermelho
  digitalWrite(ledVerde, HIGH);    // Acende o LED verde


// Função para fechar a cancela
void fecharCancela() {
  myServo.write(posFechada);       // Movimenta o servo para fechar a cancela
  cancelaAberta = false;
  digitalWrite(ledVerde, LOW);     // Apaga o LED verde
  digitalWrite(ledVermelho, HIGH); // Acende o LED vermelho
  Serial.println("3");             // Envia o sinal "3" indicando que a cancela foi fechada
}
