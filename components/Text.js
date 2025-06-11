import { Text } from 'react-native';
import { Fonts } from '../styles/fonts';

export default function Text({ children, style, bold = false }) {
  return (
    <Text style={[
      { 
        fontFamily: bold ? Fonts.Bold : Fonts.Regular, // Автовыбор жирного/обычного
        fontSize: 16, // Размер по умолчанию
      },
      style // Позволяет переопределить стили
    ]}>
      {children}
    </Text>
  );
}