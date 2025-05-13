import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { gStyle } from '../styles/style';

export default function Account() {
  return (
    <View style={gStyle.main}>
        <Text style={gStyle.title}>Ваш аккаунт</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});
