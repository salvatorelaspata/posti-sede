import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const SpecialTabButton = () => {
  const router = useRouter();
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(app)/modalCreateSchedule');
  };

  const whiteTextColor = useThemeColor({}, 'whiteText');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { backgroundColor: tintColor }]} activeOpacity={0.85}>
      <Ionicons name="add-circle" size={30} color={whiteTextColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: [{ translateX: -40 }],

    borderRadius: 24,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
  }
});