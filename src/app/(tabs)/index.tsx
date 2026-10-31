import { useAppSelector } from '../../store/hooks';
import { ContinueWatching } from '../../features/learning/ContinueWatching';
import { Text, View } from 'react-native';
import { AppLink } from '../../components/AppLink';
import { Screen } from '../../components/Screen';
import { styles } from '../../styles';

export default function HomeScreen() {
  const entryCount = useAppSelector((state) => state.diary.entries.length);
  return (
    <Screen>
      <Text accessibilityRole="header" style={styles.title}>
        Home
      </Text>
      <Text style={styles.text}>
        Riding courses and your training notes in one place.
      </Text>
      <ContinueWatching />
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>
          Courses
        </Text>
        <Text style={styles.text}>
          Browse courses in dressage, jumping, groundwork and horse care.
        </Text>
        <AppLink href="/courses" label="Browse courses" />
      </View>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>
          Training diary
        </Text>
        <Text style={styles.text}>
          {entryCount
            ? `${entryCount} training ${entryCount === 1 ? 'entry' : 'entries'}.`
            : 'Keep notes about your rides and how they felt.'}
        </Text>
        <AppLink href="/diary" label="Open diary" />
      </View>
    </Screen>
  );
}
