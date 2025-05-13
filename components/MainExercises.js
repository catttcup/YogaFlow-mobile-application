import React from 'react';
import { Video } from 'expo-av';
import { StyleSheet, Text, View } from 'react-native';
import { gStyle } from '../styles/style';

export default function MainExercises() {
  const video1 = React.useRef(null);
  const video2 = React.useRef(null);
  const video3 = React.useRef(null);
  const [status1, setStatus1] = React.useState({});
  const [status2, setStatus2] = React.useState({});
  const [status3, setStatus3] = React.useState({});

  return (
    <View style={gStyle.main}>
      <Text style={gStyle.title}>Добро пожаловать!</Text>
      <Text style={gStyle.title}>Как Вы сегодня себя чувствуете?</Text>
      
      <View style={styles.videoContainer}>
      <Text style={gStyle.title}>Утренняя йога-зарядка</Text>
        <Video
          ref={video1}
          style={styles.video}
          source={require("./video1.mp4")}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus1(status)}
        />
        <Text style={gStyle.title}>Мягкая расстяжка на всё тело</Text>
        <Video
          ref={video2}
          style={styles.video}
          source={require("./video2.mp4")}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus2(status)}
        />
        <Text style={gStyle.title}>Вечерняя йога для расслабления</Text>
        <Video
          ref={video3}
          style={styles.video}
          source={require("./video3.mp4")}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus3(status)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flexDirection: 'column', // Располагаем видео друг под другом
    justifyContent: 'space-between',
    marginTop: 20,
    flex: 1
  },
  video: {
    flex: 1,
    alignSelf: 'stretch',
    height: 200, // Указываем высоту в пикселях
    width: '100%',
    marginBottom: 20 // Отступ между видео
  }
});
