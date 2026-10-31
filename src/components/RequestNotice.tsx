import { ActivityIndicator, Text } from 'react-native';
import { ActionButton } from './ActionButton';
import { Screen } from './Screen';
import { styles } from '../styles';

export function RequestNotice({
  loading = false,
  message,
  onRetry,
}: {
  loading?: boolean;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Screen>
      {loading && (
        <ActivityIndicator color="#286440" accessibilityLabel={message} />
      )}
      <Text
        accessibilityRole={loading ? undefined : 'alert'}
        style={styles.text}
      >
        {message}
      </Text>
      {onRetry && <ActionButton label="Try again" onPress={onRetry} />}
    </Screen>
  );
}
