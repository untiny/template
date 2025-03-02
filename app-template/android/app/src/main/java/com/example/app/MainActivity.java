package com.example.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Logger;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            MqttAsyncClient client = new MqttAsyncClient(
                    "tcp://service.58mhg.com:3010",
                    MqttAsyncClient.generateClientId(),
                    new MemoryPersistence()
            );
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setUserName("mhgface");
            options.setPassword("7vqzXz73ZypTp5BV".toCharArray());

            client.connect(options, null, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    Logger.debug("Connected to MQTT broker");
                    try {
                        client.subscribe("#", 0, ((topic, message) -> {
                            Logger.debug("Received message: " + new String(message.getPayload()));
                        }));
                    } catch (MqttException e) {
                        throw new RuntimeException(e);
                    }
                }
                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    Logger.debug("Failed to connect to MQTT broker: " + exception.getMessage());
                }
            });

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
