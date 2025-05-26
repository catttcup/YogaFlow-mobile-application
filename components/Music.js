import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatTime = millis => {
  if (!millis) return '00:00';
  const totalSec = Math.floor(millis / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
};

function Player({ source }) {
  const soundRef = useRef(new Audio.Sound());
  const [status, setStatus] = useState({
    isLoaded: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 1,
    volume: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { sound, status } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false },
        st => {
          if (st.isLoaded) setStatus(st);
        }
      );
      if (!cancelled) {
        soundRef.current = sound;
        setStatus(status);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      soundRef.current.unloadAsync();
    };
  }, [source]);

  const togglePlay = () =>
    status.isPlaying
      ? soundRef.current.pauseAsync()
      : soundRef.current.playAsync();

  const onSeek = v =>
    soundRef.current.setPositionAsync(v * status.durationMillis);

  const toggleMute = () =>
    soundRef.current.setVolumeAsync(status.volume > 0 ? 0 : 1);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={styles.icon.color} />
      </View>
    );
  }

  return (
    <View style={styles.pill}>
      <TouchableOpacity onPress={togglePlay} style={styles.iconBtn}>
        <Ionicons
          name={status.isPlaying ? 'pause' : 'play'}
          size={20}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={styles.timer}>
        {formatTime(status.positionMillis)} / {formatTime(status.durationMillis)}
      </Text>

      <Slider
        style={styles.progress}
        minimumValue={0}
        maximumValue={1}
        value={status.positionMillis / status.durationMillis}
        minimumTrackTintColor={styles.icon.color}
        maximumTrackTintColor="rgba(0,0,0,0.1)"
        thumbTintColor={styles.icon.color}
        onSlidingComplete={onSeek}
      />

      <TouchableOpacity onPress={toggleMute} style={styles.iconBtn}>
        <Ionicons
          name={status.volume > 0 ? 'volume-high' : 'volume-mute'}
          size={18}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function Music() {
  // Список треков с заголовками и путями
  const tracks = [
    { title: 'Расслабление', file: require('../assets/music1.mp3') },
    { title: 'Спокойствие',  file: require('../assets/music2.mp3') },
    { title: 'Лесной дождь',        file: require('../assets/rain.mp3') },
    { title: 'Звуки природы',      file: require('../assets/nature.mp3') },
    { title: 'Морской бриз',         file: require('../assets/sea.mp3') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Музыка под ваше настроение</Text>
      {tracks.map((t, i) => (
        <View key={i} style={{ width: '100%', alignItems: 'center' }}>
          <Text style={styles.trackTitle}>{t.title}</Text>
          <Player source={t.file} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 244, 229)',
    alignItems: 'center',
    paddingTop: 40
  },
  header: {
    color: 'rgb(93, 74, 57)',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign:'center'
  },
  loaderContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: 'rgba(234, 216, 192, 1)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 10
  },
  iconBtn: {
    paddingHorizontal: 6
  },
  icon: {
    color: 'rgb(93, 74, 57)'
  },
  timer: {
    color: 'rgb(93, 74, 57)',
    fontSize: 12,
    marginHorizontal: 8,
    minWidth: 60,
    textAlign: 'center'
  },
  progress: {
    flex: 1,
    height: 20
  },
  trackTitle: {
    color: 'rgb(93, 74, 57)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  }
});