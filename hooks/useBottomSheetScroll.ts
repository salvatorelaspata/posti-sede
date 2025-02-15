import { useEffect, useRef } from 'react';
import { ScrollView, Dimensions } from 'react-native';

interface UseBottomSheetScrollProps {
    selectedItemId: string | null;
    isOpen: boolean;
    snapPoints: Array<string | number>;
}

interface MeasuredItem {
    id: string;
    y: number;
    height: number;
}

export const useBottomSheetScroll = ({
    selectedItemId,
    isOpen,
    snapPoints
}: UseBottomSheetScrollProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const itemsPosition = useRef<Map<string, MeasuredItem>>(new Map());
    const { height: screenHeight } = Dimensions.get('window');

    const measureItem = (id: string, y: number, height: number) => {
        itemsPosition.current.set(id, { id, y, height });
    };

    const scrollToSelectedItem = () => {
        if (!scrollViewRef.current || !selectedItemId) return;

        const selectedItem = itemsPosition.current.get(selectedItemId);
        if (!selectedItem) return;

        // Convert first snap point to number (removing % if string)
        const bottomSheetHeight = typeof snapPoints[0] === 'string'
            ? (parseFloat(snapPoints[0]) / 100) * screenHeight
            : snapPoints[0];

        const safeAreaBottom = screenHeight - bottomSheetHeight;
        const itemBottom = selectedItem.y + selectedItem.height;

        if (itemBottom > safeAreaBottom) {
            const scrollOffset = itemBottom - safeAreaBottom + 16; // Adding padding
            scrollViewRef.current.scrollTo({
                y: scrollOffset,
                animated: true
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure measurements are complete
            setTimeout(scrollToSelectedItem, 100);
        }
    }, [isOpen, selectedItemId]);

    return {
        scrollViewRef,
        measureItem
    };
};