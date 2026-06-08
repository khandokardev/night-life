import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

interface Props {
  size?: number;
}

const LOGO_RATIO = 1000 / 830;

export function SaPlugIcon({ size = 88 }: Props) {
  const h = size;
  const w = Math.round(size * LOGO_RATIO);
  return (
    <View style={{ width: w, height: h, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: w, height: h }}
        contentFit="contain"
      />
    </View>
  );
}
