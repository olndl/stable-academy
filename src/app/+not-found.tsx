import { Text } from 'react-native';
import { AppLink } from '../components/AppLink';
import { Screen } from '../components/Screen';
import { styles } from '../styles';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Text accessibilityRole="header" style={styles.title}>
        Page not found
      </Text>
      <Text style={styles.text}>This screen doesn’t exist.</Text>
      <AppLink href="/" label="Back to home" />
    </Screen>
  );
}
