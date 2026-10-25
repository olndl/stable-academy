import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export function AppLink({ href, label }: { href: Href; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={styles.button}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: '#286440',
  },
  label: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
