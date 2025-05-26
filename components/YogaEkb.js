import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';

export default function MainCards() {
  const cardItems = [
    {
      key: '1',
      title: 'Занимаемся йогой вместе',
      subtitle: 'Группы и чаты в VK для занятия йогой в Екатеринбурге',
      image: require('./vkk.jpg'),
      links: [
        'https://vk.me/join/OtfCMsEt3L9GOJ_lEdWS6mdKFG/MPHlctW8=',
        'https://vk.com/sunkalpa_ekb',
        'https://vk.com/sostoyaniesoznaniyglavnoe',
        'https://vk.com/grani.yoga',
      ],
      date: '25.05.25',
    },
    {
      key: '3',
      title:
        'В Шарташском лесопарке появится первое pop-up пространство',
      subtitle:
        '«Наш Шарташ» предложит разнообразные мероприятия, в том числе и йогу',
      image: require('./83pop.jpg'),
      link: 'https://momenty.org/city/28277',
      date: '17.03.25',
    },
    {
      key: '2',
      title: 'Создаём Бали в Екатеринбурге',
      subtitle: 'Почему популярна горячая йога',
      image: require('./hot.jpg'),
      link: 'https://momenty.org/city/26828',
      date: '14.10.24',
    },
  ];

  const openLink = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn('Не удалось открыть ссылку: ' + url);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {cardItems.map((item, idx) => (
        <View key={item.key}>
          <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

            {item.links &&
              item.links.map((url, i) => (
                <Text
                  key={i}
                  style={styles.linkText}
                  onPress={() => openLink(url)}
                >
                  {`${i + 1}. ${url}`}
                </Text>
              ))}

            {item.link && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => openLink(item.link)}
              >
                <Text style={styles.buttonText}>Подробнее</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.dateBadge}>{item.date}</Text>
          </View>
          {idx < cardItems.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,244,229,1)',
  },
  content: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#0066CC',
    textDecorationLine: 'underline',
    marginBottom: 4,
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  dateBadge: {
    alignSelf: 'flex-end',
    marginTop: 12,
    fontSize: 12,
    color: '#333',
  },
});