import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';


export default function ProgressBar({ progress = 0, height = 10, style }) {
    const widthAnim = React.useRef(new Animated.Value(0)).current;


    React.useEffect(() => {
        Animated.timing(widthAnim, {
        toValue: Math.max(0, Math.min(1, progress)),
        duration: 350,
        useNativeDriver: false,
        }).start();
    }, [progress]);


    const barInterpolation = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    });


    return (
        <View style={[styles.container, { height }, style]}>
            <View style={styles.track} />
            <Animated.View style={[styles.fill, { width: barInterpolation, height }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    track: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#dfe6ee',
        borderRadius: 50,
    },
    fill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0b4e91',
        borderRadius: 50,
    },
});