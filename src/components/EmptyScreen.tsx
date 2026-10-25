import { Text, View } from 'react-native';
import { Screen } from './Screen';
import { styles } from '../styles';

export function EmptyScreen({
  title,
  message,
  description,
}: {
  title: string;
  message: string;
  description: string;
}) {
  return (
    <Screen>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>
          {message}
        </Text>
        <Text style={styles.text}>{description}</Text>
      </View>
    </Screen>
  );
}
