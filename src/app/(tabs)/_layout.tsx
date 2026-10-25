import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: 'Stable Academy',
        headerTitleStyle: { fontSize: 20 },
        headerShadowVisible: false,
        tabBarActiveTintColor: '#286440',
        tabBarInactiveTintColor: '#555555',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIconStyle: { display: 'none' },
        tabBarItemStyle: { justifyContent: 'center', minHeight: 44 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="courses" options={{ title: 'Courses' }} />
      <Tabs.Screen name="my-learning" options={{ title: 'My learning' }} />
      <Tabs.Screen name="diary" options={{ title: 'Diary' }} />
      <Tabs.Screen name="statistics" options={{ title: 'Statistics' }} />
    </Tabs>
  );
}
