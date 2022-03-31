#include <Servo.h>
#include <FastLED.h>


#define PIN_SERVO_1 8
#define PIN_LED0  7

#define NO_SERVOS (5)
Servo myservos[NO_SERVOS];

#define NO_LEDS (10)
CRGB leds[NO_LEDS];

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

  for (int s = 0; s < NO_SERVOS; s ++) {
    myservos[s].attach(PIN_SERVO_1+s);  
  }
  
  FastLED.addLeds<WS2812B, PIN_LED0, GRB >(leds, NO_LEDS);


}

void loop() {
  static int dir  = 1;
  static int pos = 0;

  loop_serial();

  for (int s = 0; s < NO_SERVOS; s++) {
    myservos[s].write(pos);              // tell servo to go to position in variable 'pos'
  }
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
//  static uint8_t hue = 0;
//  leds[0] = CHSV(hue,255,255);
//  leds[1] = CHSV(hue+127,255,255);
//  hue ++;
//  if (hue > 255) hue = 0;
//  
  for (int led = 0; led < NO_LEDS; led++) {
    if (pos < 60) {
      leds[led] = CRGB::Red;
    } else if (pos > 120) {
      leds[led] = CRGB::Green;
    } else {
      leds[led] = CRGB::Blue;
    }
  }



  FastLED.show();
  
}
