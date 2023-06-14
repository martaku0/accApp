import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import sett from "./settings.json"

const WS_URL = `ws://${sett.address}:${sett.port}`;

export default function App() {
  const [socketUrl, setSocketUrl] = useState(WS_URL);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [sending, setSending] = useState(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setData)
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });

  useEffect(() => {
    if (sending) {
      sendMessage(`${x}|${y}|${z}`);
    }
  }, [sending, x, y, z]);

  const changeSending = () => {
    setSending(!sending)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={changeSending} style={styles.button}>
          <Text>{sending ? 'Do not send data' : 'Start sending data'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 0.2,
    flexDirection: 'column',
    marginTop: 15,
    gap: 10
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
