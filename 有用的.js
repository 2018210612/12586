#include <ESP8266WiFi.h>
#define ledPin 4 // 定义ledPin连接到GPIO4
const char* ssid = "XXXXXX"; // XXXXXX -- 使用时请修改为当前你的 wifi ssid
const char* password = "XXXXXX"; // XXXXXX -- 使用时请修改为当前你的 wifi 密码
const char* host = "www.yeelink.net";
const char* APIKEY = "XXXXXX"; //API KEY
int deviceId = XXXXX;
int sensorId = XXXXX;

WiFiClient client;
const int tcpPort = 80;
char data[512] ;
int x = 0;
int dat = 0;

void setup() {
WiFi.mode(WIFI_AP_STA); //set work mode: WIFI_AP /WIFI_STA /WIFI_AP_STA
Serial.begin(115200);
pinMode(ledPin, OUTPUT);
delay(10);

// We start by connecting to a WiFi network
Serial.println("");
Serial.print("Connecting to ");
Serial.println(ssid);

WiFi.begin(ssid, password);

while (WiFi.status() != WL_CONNECTED) {
delay(500);
Serial.print(".");
}

Serial.println("");
Serial.println("WiFi connected");
Serial.print("IP address: ");
Serial.println(WiFi.localIP());
}

void loop() {
delay(2000);

if (!client.connect(host, tcpPort)) {
Serial.println("connection failed");
return;
}

// We now create a URI for the request
String url = "/v1.0/device/";
url += String(deviceId);
url += "/sensor/";
url += String(sensorId);
url += "/datapoints";

// This will send the request to the server
client.print(String("GET ") + url + " HTTP/1.1\r\n" +
"Host: " + host + "\r\n" +
// "Accept: */*\r\n"+
"U-ApiKey:" + APIKEY + "\r\n"
"Connection: close\r\n\r\n");

unsigned long timeout = millis();
while (client.available() == 0) {
if (millis() - timeout > 2000) {
Serial.println(">>> Client Timeout !");
client.stop();
return;
}
}

// Read all the lines of the reply from server and print them to Serial
while(client.available()){
int e = client.read();
if(e == '{'&&x == 0){
x = 1;
}else if(x == 1){
data[dat] = e;
// Serial.print(e);
if(e == '}'){
digitalWrite(ledPin,data[dat-1]-'0');
Serial.print("button value :");
Serial.print(data[dat-1]);
Serial.print("\t");
x = 0;
dat = 0;
break;
}
dat++;
}
}

// Serial.println();
Serial.println("closing connection");
}

//void colLED(char sta){
// if (sta == '0') {
// digitalWrite(ledPin, LOW);
// }
// if (sta == '1') {
// digitalWrite(ledPin, HIGH);
// }
//}
