import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16; // отступ слева и справа
const AVAILABLE_WIDTH = width - HORIZONTAL_PADDING * 2; // доступная ширина для календаря
const DAY_SIZE = AVAILABLE_WIDTH / 7; // размер одного кружочка
const DAY_FONT_SIZE = DAY_SIZE / 3;

export default function Account() {
  const year = 2025;
  const month = 5; // 0 = Январь, …, 5 = Июнь (текущий месяц)

  // Определяем цвета:
  const colors = [
    'rgba(234,216,192,1)', // нейтральный для активных дней (если оценка ещё не поставлена)
    '#FF6666',             // оценка 1 (Очень плохо)
    '#FFB266',             // оценка 2 (Плохо)
    '#FFFF66',             // оценка 3 (Удовлетворительно)
    '#B2FF66',             // оценка 4 (Хорошо)
    '#66FF66',             // оценка 5 (Отлично)
  ];
  // Цвет для неактивных дней (дни предыдущего и следующего месяца)
  const inactiveColor = 'rgba(255,244,229,1)';

  // Подписи для кружочков (индекс 0 – пустой, далее цифры используются только внутри модального окна)
  const labels = ['', '1', '2', '3', '4', '5'];

  const [marks, setMarks] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Загружаем ранее сохранённые оценки
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('@marks');
      if (json) setMarks(JSON.parse(json));
    })();
  }, []);

  // Функция сохранения оценок
  const saveMarks = async newMarks => {
    setMarks(newMarks);
    await AsyncStorage.setItem('@marks', JSON.stringify(newMarks));
  };

  // При выборе цвета назначаем его выбранной дате (только для текущего месяца) и закрываем модальное окно
  const onPickColor = color => {
    const newMarks = { ...marks, [selectedDay]: color };
    saveMarks(newMarks);
    setModalVisible(false);
  };

  // Генерируем календарь из 42 ячеек (6 строк по 7 дней) с учетом того, что первым днем недели является понедельник.
  // Дни предыдущего месяца (май) и следующего месяца (июль) маркируются как неактивные.
  const generateCalendar = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // дни текущего месяца (июнь)
    // Определяем день недели для 1 числа.
    // Приводим результат getDay() (0 = воскресенье) к формату, где понедельник = 0:
    const firstDayJS = new Date(year, month, 1).getDay();
    const shift = (firstDayJS + 6) % 7;
    const daysInPrevMonth = new Date(year, month, 0).getDate(); // дни предыдущего месяца (май)
    const totalCells = 42;
    let cells = [];

    // Ячейки предыдущего месяца (неактивные)
    for (let i = 0; i < shift; i++) {
      const day = daysInPrevMonth - shift + i + 1;
      cells.push({ day, monthType: 'prev' });
    }

    // Ячейки текущего месяца (активные)
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, monthType: 'current' });
    }

    // Ячейки следующего месяца (неактивные)
    const remaining = totalCells - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, monthType: 'next' });
    }

    return cells;
  };

  const cells = generateCalendar();

  // Подсчет оценок (для активных дней текущего месяца)
  const colorCounts = {
    '#FF6666': 0,  // Очень плохо
    '#FFB266': 0,  // Плохо
    '#FFFF66': 0,  // Удовлетворительно
    '#B2FF66': 0,  // Хорошо
    '#66FF66': 0,  // Отлично
  };

  Object.values(marks).forEach(markColor => {
    if (colorCounts[markColor] !== undefined) {
      colorCounts[markColor]++;
    }
  });

  // Подписи для счётчика оценок
  const colorLabels = {
    '#FF6666': 'Очень плохо',
    '#FFB266': 'Плохо',
    '#FFFF66': 'Удовлетворительно',
    '#B2FF66': 'Хорошо',
    '#66FF66': 'Отлично',
  };

  // Подсчет дней текущего месяца (июнь)
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // Дней, для которых ещё не поставлена оценка
  const notRatedCount = totalDaysInMonth - Object.keys(marks).length;
  // Дней, у которых оценка равна нейтральной (цвет colors[0])
  const explicitlyNeutralCount = Object.values(marks).filter(
    mark => mark === colors[0]
  ).length;
  // Итоговый счётчик «Не пройдено»
  const notPassedCount = notRatedCount + explicitlyNeutralCount;

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <Text style={styles.title}>Ваш прогресс</Text>
      <Text style={styles.monthTitle}>Июнь 2025</Text>

      {/* Шапка календаря (дни недели, начиная с понедельника) */}
      <View style={styles.weekHeader}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, idx) => (
          <Text key={idx} style={styles.weekDay}>{d}</Text>
        ))}
      </View>

      {/* Календарь */}
      <View style={styles.calendar}>
        {cells.map((cell, idx) => {
          const isActive = cell.monthType === 'current';
          // Если ячейка активная, то используем оценку (или дефолтный нейтральный цвет из colors[0]),
          // если ячейка неактивная, то используем inactiveColor.
          const bgColor = isActive ? (marks[cell.day] || colors[0]) : inactiveColor;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.dayContainer, { backgroundColor: bgColor }]}
              activeOpacity={isActive ? 0.7 : 1}
              onPress={() => {
                if (!isActive) return;
                setSelectedDay(cell.day);
                setModalVisible(true);
              }}
            >
              <Text style={styles.dayText}>{cell.day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Счётчики оценок */}
      <View style={styles.countersContainer}>
        <Text style={styles.countersTitle}>Ваши оценки тренировок:</Text>
        <View style={styles.countersColumn}>
          {/* Счётчик для не пройденных (бежевые клетки считаются как «не пройдено») */}
          <View style={styles.counterItem}>
            <View style={[styles.counterColorCircle, { backgroundColor: colors[0] }]} />
            <Text style={styles.counterText}>
              Не пройдено: {notPassedCount}
            </Text>
          </View>
          {colors.slice(1).map(color => (
            <View key={color} style={styles.counterItem}>
              <View style={[styles.counterColorCircle, { backgroundColor: color }]} />
              <Text style={styles.counterText}>
                {colorLabels[color]}: {colorCounts[color]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Модальное окно для выбора оценки (только для текущих дней) */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Как вы оцениваете тренировку {selectedDay} июня?
            </Text>

            {/* Первый ряд: нейтральный, 1 и 2 */}
            <View style={styles.colorRow}>
              {colors.slice(0, 3).map((col, i) => (
                <TouchableOpacity
                  key={col}
                  style={[styles.colorCircle, { backgroundColor: col }]}
                  onPress={() => onPickColor(col)}
                >
                  {labels[i] !== '' && (
                    <Text style={styles.colorLabel}>{labels[i]}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 12 }} />

            {/* Второй ряд: 3, 4 и 5 */}
            <View style={styles.colorRow}>
              {colors.slice(3).map((col, j) => {
                const idxLabel = j + 3;
                return (
                  <TouchableOpacity
                    key={col}
                    style={[styles.colorCircle, { backgroundColor: col }]}
                    onPress={() => onPickColor(col)}
                  >
                    <Text style={styles.colorLabel}>{labels[idxLabel]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: 'rgba(255, 244, 229, 1)',
    paddingTop: 20,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  weekHeader: {
    flexDirection: 'row',
    width: AVAILABLE_WIDTH,
    alignSelf: 'center',
    marginBottom: 6,
  },
  weekDay: {
    width: DAY_SIZE,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: DAY_FONT_SIZE,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: AVAILABLE_WIDTH,
    alignSelf: 'center',
  },
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dayText: {
    fontSize: DAY_FONT_SIZE,
    color: '#000',
  },
  countersContainer: {
    marginTop: 10,
    width: '100%',
  },
  countersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  countersColumn: {
    flexDirection: 'column',
  },
  counterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  counterColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  counterText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255,244,229,1)',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: 12,
    textAlign: 'center',
    color: 'rgba(93,74,57,1)',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    color: 'rgba(93,74,57,1)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});