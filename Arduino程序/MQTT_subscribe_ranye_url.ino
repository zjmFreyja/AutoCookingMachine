#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Ticker.h>
//#include <stdio.h>
//#include <stdlib.h>
//#include <Adafruit_GFX.h>
//#include <Adafruit_SSD1306.h>

// 设置wifi接入信息(请根据您的WiFi信息进行修改)
const char* ssid = "Freyja";
const char* password = "QaZwSxEdC";


const char* mqttServer = "broker.emqx.io";
// 如以上MQTT服务器无法正常连接，请前往以下页面寻找解决方案
// http://www.taichi-maker.com/public-mqtt-broker/
String subdata = "";
String comdata = "";
String comdata2 = "";
String comdata3 = "";
unsigned int num = 0;
unsigned int state = 0;
Ticker ticker;


int count;    // Ticker计数用变�?
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void setup() {
//  pinMode(LED_BUILTIN, OUTPUT); // 设置板上LED引脚为输出模�?
//  pinMode(12, OUTPUT); 
  
  Serial.begin(115200);               // 启动串口通讯

  //设置ESP8266工作模式为无线终端模�?
  WiFi.mode(WIFI_STA);

  // 连接WiFi
  connectWifi();

  // 设置MQTT服务器和端口�?
  mqttClient.setServer(mqttServer, 1883);
  // 设置MQTT订阅回调函数
  mqttClient.setCallback(receiveCallback);

  // 连接MQTT服务�?
  connectMQTTserver();

  // Ticker定时对象
  ticker.attach(1, tickerCount);

}

void loop() {
  if (mqttClient.connected()) { 
    // 如果开发板成功连接服务�? 
   // if(count == 1){
    pubMQTTmsg();
    comdata="";
    //count =0;
    
    mqttClient.loop();          // 处理信息以及心跳
  } else {                      // 如果开发板未能成功连接服务�?
    connectMQTTserver();        // 则尝试连接服务器
  }
}
//}


void tickerCount() {
  count++;
}

// 连接MQTT服务器并订阅信息
void connectMQTTserver() {
  // 根据ESP8266的MAC地址生成客户端ID（避免与其它ESP8266的客户端ID重名�?
  String clientId = "ChaoCaiJi" + WiFi.macAddress();

  // 连接MQTT服务�?
  if (mqttClient.connect(clientId.c_str())) {
    Serial.println("MQTT Server Connected.");
    Serial.println("Server Address:");
    Serial.println(mqttServer);
    Serial.println("ClientId: ");
    Serial.println(clientId);
    subscribeTopic(); // 订阅指定主题
  }
  else {
    Serial.print("MQTT Server Connect Failed. Client State:");
    Serial.println(mqttClient.state());
    delay(3000);
  }
}



// 收到信息后的回调函数
void receiveCallback(char* topic, byte* payload, unsigned int length) {
    for (int i = 0; i < length; i++) {
      subdata += (char)payload[i];
//     Serial.print((char)payload[i]);
    }
    Serial.println(subdata);
//    if (subdata  == "\"Teststr1\"" ){Serial.println("@Teststr1"); subdata = "";} 
//    else if (subdata  == "\"Teststr1stop\"" ){Serial.println("@Teststr1stop");subdata = "";} 
    subdata = ""; 
}

// 订阅指定主题
void subscribeTopic() {

  // 建立订阅主题。主题名称以Taichi-Maker-Sub为前缀，后面添加设备的MAC地址�?
  // 这么做是为确保不同设备使用同一个MQTT服务器测试消息订阅时，所订阅的主题名称不�?
  String topicString = "ChaoCaiJiByZYJ_Sub";
  char subTopic[topicString.length() + 1];
  strcpy(subTopic, topicString.c_str());

  // 通过串口监视器输出是否成功订阅主题以及订阅的主题名称
  if (mqttClient.subscribe(subTopic)) {
    Serial.println("Subscrib Topic:");
    Serial.println(subTopic);
  } else {
    Serial.print("Subscribe Fail...");
  }

}

// ESP8266连接wifi
void connectWifi() {

  WiFi.begin(ssid, password);

  //等待WiFi连接,成功连接后输出成功信�?
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi Connected!");
  Serial.println("");
  pinMode(LED_BUILTIN, OUTPUT); // 设置板上LED引脚为输出模�?
  pinMode(12, OUTPUT); 
}


// 发布信息 格式{ 要发布的讯息 }
void pubMQTTmsg() {
  
  String topicString = "ChaoCaiJiByZYJ_Pub" ;
  char publishTopic[topicString.length() + 1];
  strcpy(publishTopic, topicString.c_str());
 
  while(Serial.available()>0)      
  {
    comdata += char(Serial.read());
    delay(8);
  }  
/*****************************************************************************/  
  if (comdata.charAt(0)  == '{'){
  // 建立发布信息。信息内容以Hello World为起始，后面添加发布次数�?
  String messageString = comdata;
  char publishMsg[messageString.length() + 1];
  strcpy(publishMsg, messageString.c_str());

  // 实现ESP8266向主题发布讯息
  if (mqttClient.publish(publishTopic, publishMsg)) {
//    Serial.println("Publish message:"); Serial.println(publishMsg);
    comdata="";
  } 
  else {Serial.println("Message Publish Failed."); }   
  }

  else{ comdata="";}

}
