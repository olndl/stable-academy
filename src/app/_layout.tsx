import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider } from '../providers/StoreProvider';
import { QueryProvider } from '../providers/QueryProvider';

export default function RootLayout() {
  return (
    <StoreProvider>
      <QueryProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="courses/[courseId]"
            options={{ title: 'Course' }}
          />
          <Stack.Screen
            name="lessons/[courseId]/[lessonId]"
            options={{ title: 'Lesson' }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ title: 'Page not found' }}
          />
        </Stack>
      </QueryProvider>
    </StoreProvider>
  );
}
