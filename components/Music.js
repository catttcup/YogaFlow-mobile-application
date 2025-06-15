import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';

const tracks = [
  {
    id: 1,
    title: "Расслабление",
    duration: "2 мин",
    icon: require('../assets/audio_screensaver/1.jpg'),
    audio: require('../assets/music/music1.mp3')
  },
  {
    id: 2,
    title: "Спокойствие",
    duration: "2 мин",
    icon: require('../assets/audio_screensaver/2.png'),
    audio: require('../assets/music/music2.mp3')
  },
  {
    id: 3,
    title: "Лесной дождь",
    duration: "5 мин",
    icon: require('../assets/audio_screensaver/forest_rain.png'),
    audio: require('../assets/music/rain.mp3')
  },
  {
    id: 4,
    title: "Звуки природы",
    duration: "5 мин",
    icon: require('../assets/audio_screensaver/nature.png'),
    audio: require('../assets/music/nature.mp3')
  },
  {
    id: 5,
    title: "Морской бриз",
    duration: "6 мин",
    icon: require('../assets/audio_screensaver/sea.png'),
    audio: require('../assets/music/sea.mp3')
  }
];

export default function MusicScreen() {
  const [sound, setSound] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playTrack(track) {
    if (sound) {
      await sound.unloadAsync();
    }
    
    const { sound: newSound } = await Audio.Sound.createAsync(track.audio);
    setSound(newSound);
    setCurrentTrack(track.id);
    setIsPlaying(true);
    await newSound.playAsync();
  }

  async function stopPlayback() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  }

  async function toggleMainPlay() {
    if (isPlaying) {
      await stopPlayback();
    } else {
      await playTrack(tracks[0]);
    }
  }

  useEffect(() => {
    return sound
      ? () => sound.unloadAsync()
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
     
      
      {/* Главная кнопка включения с фоновым изображением */}
      <View style={styles.mainPlayContainer}>
        <TouchableOpacity onPress={toggleMainPlay}>
          <ImageBackground 
            source={require('../assets/audio_screensaver/wheat.png')} // Замените на нужное изображение
            style={styles.mainPlayBackground}
            imageStyle={styles.mainPlayImage}
          >
            <View style={styles.mainPlayOverlay}>
              <Text style={styles.mainPlayTitle}>Расслабляющие звуки</Text>
              <Text style={styles.mainPlayButtonText}>
                {isPlaying ? '⏸ Остановить' : '▶ Включить музыку'}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* Список треков */}
      <View style={styles.tracksContainer}>
        {tracks.map(track => (
          <View key={track.id} style={styles.trackItem}>
            <Image source={track.icon} style={styles.trackIcon} />
            
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackDuration}>{track.duration}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => currentTrack === track.id ? stopPlayback() : playTrack(track)}
              style={[
                styles.controlButton,
                currentTrack === track.id && styles.controlButtonActive
              ]}
            >
              <Text style={styles.controlText}>
                {currentTrack === track.id ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF4E5'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3a3a3a'
  },
  mainPlayContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden'
  },
  mainPlayBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainPlayImage: {
    borderRadius: 10,
  },
  mainPlayOverlay: {
    
    padding: 20,
    borderRadius: 10,
    width: 350,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainPlayTitle: {
    color: '#5D4A39',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  mainPlayButtonText: {
    color: '#FFF4E5',
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: 'rgba(109, 76, 65, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  tracksContainer: {
    marginBottom: 20
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#E5D7C3',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  trackIcon: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5
  },
  trackInfo: {
    flex: 1
  },
  trackTitle: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 3
  },
  trackDuration: {
    fontSize: 14,
    color: '#888'
  },
  controlButton: {
    backgroundColor: '#6d4c41',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlButtonActive: {
    backgroundColor: '#6d4c41'
  },
  controlText: {
    color: '#E5D7C3',
    fontSize: 16
  }
});