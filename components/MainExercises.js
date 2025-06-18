import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoApp = () => {
  const [activeFilter, setActiveFilter] = useState('Все');
  const videoRefs = useRef({});

  // Данные для фильтров с иконками (русские названия)
  const filters = [
    { id: 'Все', label: 'Все', icon: require('../assets/icons/calm.png') },
    { id: 'Утро', label: 'Утро', icon: require('../assets/icons/relax.png') },
    { id: 'Вечер', label: 'Вечер', icon: require('../assets/icons/focus.png') },
    { id: 'Растяжка', label: 'Растяжка', icon: require('../assets/icons/anxious.png') }
    
  ];

  // Данные для видео
  const videoContent = {
    'Все': [
      { id: '1', title: "Утренняя медитация", source: require('../components/video1.mp4') },
      { id: '2', title: "Растяжка для начинающих", source: require('../components/video2.mp4') },
      { id: '3', title: "Вечерний йога", source: require('../components/video3.mp4') }
    ],
    'Утро': [
      { id: '4', title: "Утренняя медитация", source: require('../components/video1.mp4') }
    ],
    'Вечер': [
      { id: '5', title: "Вечерняя йога", source: require('../components/video2.mp4') }
    ],
    'Растяжка': [
      { id: '6', title: "Растяжка для начинающих", source: require('../components/video3.mp4') }
    ]
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Приветствие */}
      <Text style={styles.header}>Добро пожаловать!</Text>
      <Text style={styles.subheader}>Как вы себя сегодня чувствуете?</Text>

      {/* Разделительная линия */}
      <View style={styles.divider} />

      {/* Фильтры с иконками */}
      <View style={styles.filtersContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={styles.filterButton}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Image 
              source={filter.icon} 
              style={[
                styles.filterIcon,
                activeFilter === filter.id && styles.filterIconActive
              ]}
            />
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Разделительная линия */}
      <View style={styles.divider} />

      {/* Список видео */}
      <View style={styles.videoList}>
        {videoContent[activeFilter].map(video => (
          <View key={video.id} style={styles.videoContainer}>
            <Video
              ref={ref => videoRefs.current[video.id] = ref}
              source={video.source}
              style={styles.videoPlayer}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              hardwareAcceleration={false} 
               isLooping={false}
              isMuted={false}
              rate={1.0}
              volume={1.0}
            />
            <Text style={styles.videoTitle}>{video.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E5'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
    color: '#5D4A39'
  },
  subheader: {
    fontSize: 16,
    textAlign: 'left',
    color: '#5D4A39',
    marginBottom: 1
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: -10,
    marginBottom: 1
  },
  filterButton: {
    alignItems: 'center',
    width: 80
  },
  filterIcon: {
    width: 73,
    height: 73,
    marginBottom: 5,
    opacity: 0.6
  },
  filterIconActive: {
    opacity: 1
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5D4A39',
    textAlign: 'center'
  },
  activeFilterText: {
    color: '#6d4c41'
  },
  videoList: {
    flex: 1
  },
  videoContainer: {
  marginBottom: 25,
  borderRadius: 8, // Скругление углов
  overflow: 'hidden', // Чтобы видео не выходило за границы
  elevation: 3, // Тень на Android (опционально)
  shadowColor: '#A3AE85',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
},
  videoPlayer: {
  width: '100%',
  height: 200,
  //backgroundColor: 'black', // Фон до загрузки видео
},
  videoTitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#5D4A39',
    textAlign: 'center'
  }
});

export default VideoApp;