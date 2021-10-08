#include <Servo.h>
#include <FastLED.h>


#define PIN_SERVO 9
#define PIN_LED0  7

Servo myservo;
// memory for the leds on the left (incomming) and right (outgoing) side.
CRGB leds[2];

/**
 * BROWN  = GROUND
 * RED    = 5V
 * ORANGE = signal (pwm)
 */

static int glb_zero_pause = false;
void(*resetFunc) (void) = 0; 



void loop_serial() {
  // ===============
  // serial business
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil(10);
    if (command.equals("restart")) {
      Serial.end();  //clears the serial monitor  if used
      resetFunc();
      delay(1000);
    } else if (command.startsWith("z")) {
      glb_zero_pause = true;
    } else if (command.startsWith("s")) {
      glb_zero_pause = false;
    } else { 
        Serial.println("commands: ");
        Serial.println("  z      : set the servo to the zero");
        Serial.println("  s      : start the servo to the zero");
        Serial.println("  restart: restart micro controller");
        Serial.flush();
    }
  } 
}


void setup() {
  Serial.begin(115200);
  Serial.println("Boot Started");

  myservo.attach(PIN_SERVO);  
  FastLED.addLeds<WS2812B, PIN_LED0, GRB >(leds, 2);


}

void loop() {
  static int dir  = 1;
  static int pos = 0;

  loop_serial();

  myservo.write(pos);              // tell servo to go to position in variable 'pos'
  delay(15);                       // waits 15ms for the servo to reach the position

  if (glb_zero_pause) {
    pos = 0;
    dir = 1;
  } else {
      pos += dir;
    if (pos > 180) {
      dir = -1;
      pos -= 2;
    } else if (pos < 0) {
      dir = 1;
      pos += 2;
  
    }
  }

  // -----------
  // LEDS
  if (pos < 60) {
    leds[0] = CRGB::Red;
    leds[1] = CRGB::Green;
  } else if (pos > 120) {
    leds[0] = CRGB::Green;
    leds[1] = CRGB::Blue;
  } else {
    leds[0] = CRGB::Blue;
    leds[1] = CRGB::Red;
  }

  FastLED.show();
  
}
