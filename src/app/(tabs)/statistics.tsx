import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import { AppLink } from '../../components/AppLink';
import { ChoiceGroup } from '../../components/FormFields';
import { Screen } from '../../components/Screen';
import { localDate } from '../../features/diary/model';
import { BarChart } from '../../features/statistics/BarChart';
import { getTrainingStatistics } from '../../features/statistics/model';
import type { StatisticsPeriod } from '../../features/statistics/model';
import { useAppSelector } from '../../store/hooks';
import { styles } from '../../styles';

const periods = [
  { value: 4, label: '4 weeks' },
  { value: 12, label: '12 weeks' },
] as const;

function sessionLabel(count: number) {
  return `${count} ${count === 1 ? 'session' : 'sessions'}`;
}

export default function StatisticsScreen() {
  const entries = useAppSelector((state) => state.diary.entries);
  const [period, setPeriod] = useState<StatisticsPeriod>(4);
  const [today, setToday] = useState(localDate);
  useFocusEffect(
    useCallback(() => {
      setToday(localDate());
      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') setToday(localDate());
      });
      return () => subscription.remove();
    }, []),
  );
  const statistics = useMemo(
    () => getTrainingStatistics(entries, period, today),
    [entries, period, today],
  );

  return (
    <Screen>
      <Text accessibilityRole="header" style={styles.title}>
        Statistics
      </Text>
      {entries.length === 0 ? (
        <View style={styles.panel}>
          <Text style={styles.text}>No training logged yet.</Text>
          <Text style={styles.text}>
            Add a diary entry to see your training statistics.
          </Text>
          <AppLink href="/diary" label="Open diary" />
        </View>
      ) : (
        <>
          <ChoiceGroup
            label="Period"
            options={periods}
            value={period}
            onChange={setPeriod}
          />
          <Text style={styles.text}>
            {statistics.startDate} – {statistics.endDate}
          </Text>
          <View style={styles.panel}>
            <Text accessibilityRole="header" style={styles.subtitle}>
              Overview
            </Text>
            <Text accessibilityLiveRegion="polite" style={styles.text}>
              {sessionLabel(statistics.sessions)} · {statistics.minutes} min
              total
            </Text>
            <Text style={styles.text}>
              Average: {statistics.averageMinutes} min per session
            </Text>
          </View>
          {statistics.sessions === 0 ? (
            <View style={styles.panel}>
              <Text style={styles.text}>
                No training in this period. Try a longer period or add a diary
                entry.
              </Text>
              <AppLink href="/diary" label="Open diary" />
            </View>
          ) : (
            <>
              <View style={styles.panel}>
                <Text accessibilityRole="header" style={styles.subtitle}>
                  Minutes per week
                </Text>
                <Text style={styles.text}>Weeks start on Monday.</Text>
                <BarChart
                  rows={statistics.weeks.map((week) => ({
                    id: week.id,
                    label: week.label,
                    value: week.minutes,
                    description: `${week.minutes} min · ${sessionLabel(week.sessions)}`,
                  }))}
                />
              </View>
              <View style={styles.panel}>
                <Text accessibilityRole="header" style={styles.subtitle}>
                  Minutes by discipline
                </Text>
                <BarChart
                  rows={statistics.disciplines.map((discipline) => ({
                    id: discipline.id,
                    label: discipline.label,
                    value: discipline.minutes,
                    description: `${discipline.minutes} min · ${sessionLabel(discipline.sessions)}`,
                  }))}
                />
              </View>
              <View style={styles.panel}>
                <Text accessibilityRole="header" style={styles.subtitle}>
                  How sessions felt
                </Text>
                <BarChart
                  maximum={statistics.sessions}
                  rows={statistics.moods.map((mood) => ({
                    id: mood.id,
                    label: mood.label,
                    value: mood.sessions,
                    description: `${sessionLabel(mood.sessions)} · ${Math.round((mood.sessions / statistics.sessions) * 100)}%`,
                  }))}
                />
              </View>
            </>
          )}
        </>
      )}
    </Screen>
  );
}
