import React from 'react';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function MainExercises() {
  const videoItems = [
    { key: '1', title: 'Утренняя йога-зарядка', source: require('./video1.mp4') },
    { key: '2', title: 'Мягкая расстяжка на всё тело', source: require('./video2.mp4') },
    { key: '3', title: 'Вечерняя йога для расслабления', source: require('./video3.mp4') },
  ];

  const videoRefs = {
    '1': React.useRef(null),
    '2': React.useRef(null),
    '3': React.useRef(null),
  };
  const [statuses, setStatuses] = React.useState({});

  // filter: 'all' | 'morning' | 'stretch' | 'evening'
  const [filter, setFilter] = React.useState('all');

  const filteredItems = React.useMemo(() => {
    if (filter === 'morning') {
      return videoItems.filter(item => item.key === '1');
    }
    if (filter === 'stretch') {
      return videoItems.filter(item => item.key === '2');
    }
    if (filter === 'evening') {
      return videoItems.filter(item => item.key === '3');
    }
    // 'all'
    return videoItems;
  }, [filter]);

  const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
    switch (fullscreenUpdate) {
      case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
        await ScreenOrientation.unlockAsync();
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        break;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Добро пожаловать!</Text>
        <Text style={styles.headerText}>Как Вы сегодня себя чувствуете?</Text>

        {/* Кнопки фильтрации */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'morning' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('morning')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'morning' && styles.filterTextActive,
              ]}
            >
              Утро
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'evening' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('evening')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'evening' && styles.filterTextActive,
              ]}
            >
              Вечер
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'stretch' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('stretch')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'stretch' && styles.filterTextActive,
              ]}
            >
              Растяжка
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredItems.map((item, idx) => (
        <React.Fragment key={item.key}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Video
              ref={videoRefs[item.key]}
              style={styles.video}
              source={item.source}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={status =>
                setStatuses(prev => ({ ...prev, [item.key]: status }))
              }
              onFullscreenUpdate={onFullscreenUpdate}
            />
          </View>
          {idx < filteredItems.length - 1 && (
            <View style={styles.separator} />
          )}
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(255,244,229,1)' },
  content: { paddingVertical: 20 },

  header: { marginBottom: 20 },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(93,74,57,1)',
    marginVertical: 4,
  },

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(163, 174, 133, 0.5)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(86, 88, 28, 1)',
  },
  filterText: {
    color: 'rgba(86, 88, 28, 1)',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
  },

  card: {
    backgroundColor: 'rgba(163, 174, 133, 1)',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: 'rgba(86, 88, 28, 1)',
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    backgroundColor: 'rgba(163, 174, 133, 1)',
  },
  separator: {
    height: 8,
    backgroundColor: 'rgba(255, 244, 229, 1)',
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 4,
  },
});