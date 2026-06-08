import { useTC } from '@/hooks/useTheme';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const tc = useTC();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: tc.bg }]}>
        <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
          This screen doesn't exist.
        </Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={[styles.linkText, { color: tc.accent }]}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20 },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 14 },
});
