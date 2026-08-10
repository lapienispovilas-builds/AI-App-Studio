import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { TrackGLPColors } from '@/constants/track-glp-theme';

const icons = {
  index: ['home', 'home-outline'],
  progress: ['trending-down', 'trending-down-outline'],
  doses: ['medical', 'medical-outline'],
  'side-effects': ['heart', 'heart-outline'],
  habits: ['water', 'water-outline'],
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: TrackGLPColors.plum,
        tabBarInactiveTintColor: '#8C858D',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#FFFEFC', borderTopColor: TrackGLPColors.border, height: 84, paddingTop: 7 },
        tabBarIcon: ({ color, focused, size }) => {
          const pair = icons[route.name as keyof typeof icons];
          return <Ionicons name={pair ? pair[focused ? 0 : 1] : 'ellipse-outline'} size={Math.min(size, 23)} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="doses" options={{ title: 'Doses' }} />
      <Tabs.Screen name="side-effects" options={{ title: 'Symptoms' }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
