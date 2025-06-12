import { useThemeColor } from '@/hooks/useThemeColor';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, forwardRef, Ref } from 'react';
import { Pressable, Text, View } from 'react-native';

type Icon = ComponentProps<typeof FontAwesome>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref: Ref<View>;
};

export const TabButton = forwardRef<View, TabButtonProps>(
  ({ isFocused, icon, children, ...props }, ref) => {
    const tintColor = useThemeColor({}, 'tint');
    const whiteTextColor = useThemeColor({}, 'whiteText');
    return (
      <Pressable
        {...props}
        style={[
          {
            // height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 5,
            padding: 10
          },
          // isFocused ? { backgroundColor: 'green' } : undefined
        ]}
      >
        <FontAwesome name={icon} size={24} color={isFocused ? tintColor : whiteTextColor} />
        {/* <Text style={[{ fontSize: 16 }, isFocused ? { color: 'white' } : undefined]}>
          {children}
        </Text> */}
      </Pressable>
    );
  }
);