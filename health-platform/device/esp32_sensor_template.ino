#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* API_URL = "http://YOUR_COMPUTER_LAN_IP:5000/api/measurements";

// Replace these demo values with readings from correctly calibrated,
// medically appropriate sensors before any real-world use.
float readHeartRateBpm() { return 72.0; }
float readSpo2Percent() { return 98.0; }
float readTemperatureC() { return 36.7; }

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> payload;
    payload["heartRate"] = readHeartRateBpm();
    payload["spo2"] = readSpo2Percent();
    payload["temperatureC"] = readTemperatureC();
    payload["source"] = "device";

    String body;
    serializeJson(payload, body);
    int status = http.POST(body);
    Serial.printf("API response: %d\n", status);
    http.end();
  }
  delay(30000);
}