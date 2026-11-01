import { StyleSheet, Text, View } from 'react-native';

interface BarRow {
  id: string;
  label: string;
  value: number;
  description: string;
}

export function BarChart({
  rows,
  maximum,
}: {
  rows: BarRow[];
  maximum?: number;
}) {
  const scale = Math.max(
    maximum ?? Math.max(...rows.map((row) => row.value)),
    1,
  );
  return (
    <View style={styles.chart}>
      {rows.map((row) => (
        <View
          key={row.id}
          accessible
          accessibilityLabel={`${row.label}: ${row.description}`}
          style={styles.row}
        >
          <View style={styles.labels}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.description}</Text>
          </View>
          <View accessible={false} style={styles.track}>
            <View
              style={[
                styles.bar,
                { width: `${Math.min((row.value / scale) * 100, 100)}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { gap: 18 },
  row: { gap: 8 },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  label: { fontSize: 15, color: '#222222' },
  value: { fontSize: 14, color: '#555555' },
  track: {
    height: 10,
    borderRadius: 2,
    backgroundColor: '#e5e5e5',
    overflow: 'hidden',
  },
  bar: { height: '100%', backgroundColor: '#286440' },
});
