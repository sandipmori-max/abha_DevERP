import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
} from 'react-native';

const CustomToast = ({
  text1,
  text2,
  icon,
  backgroundColor,
  progressColor,
  toastId,
}: any) => {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    progress.setValue(1);

    Animated.timing(progress, {
      toValue: 0,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [toastId]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        width: '94%',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor,

      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.18)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14,
          }}
        >
          <MaterialIcons
            name={icon}
            size={24}
            color="#FFF"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#FFF',
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            {text1}
          </Text>

          {!!text2 && (
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {text2}
            </Text>
          )}
        </View>
      </View>

      <View
        style={{
          height: 4,
          backgroundColor: 'rgba(255,255,255,0.15)',
        }}
      >
        <Animated.View
          style={{
            height: 4,
            width: progressWidth,
            backgroundColor: progressColor,
          }}
        />
      </View>
    </View>
  );
};

export default CustomToast;