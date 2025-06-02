import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
// import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerTitle?: string;
  haederSubtitle?: string;
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerTitle,
  haederSubtitle,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const whiteTextColor = useThemeColor({}, 'whiteText');
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  // const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerTitleAnimatedStyle = useAnimatedStyle(() => {

    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [3, 1, 1.2]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
      // scrollIndicatorInsets={{ bottom }}
      // contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme], zIndex: 1 },
            headerAnimatedStyle,
          ]}>
          <Animated.View style={{ position: 'relative', }}>
            {headerImage}
            <Animated.Text style={[headerTitleAnimatedStyle, styles.headerTitle, { color: whiteTextColor }]}>{headerTitle}</Animated.Text>
            <Animated.Text style={[headerTitleAnimatedStyle, styles.headerSubtitle, { color: whiteTextColor }]}>{haederSubtitle}</Animated.Text>
          </Animated.View>
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 999,
  },
  headerTitle: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 18,
    opacity: 0.9,
  },
});
