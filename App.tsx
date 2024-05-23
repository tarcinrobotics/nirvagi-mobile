import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View, Text, BackHandler, Animated, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [scrollY] = useState(new Animated.Value(0));
  const [headerVisible, setHeaderVisible] = useState(true);
  const [atRootPage, setAtRootPage] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const backAction = () => {
      if (!atRootPage) {
        webViewRef.current?.goBack();
        return true;
      } else {
        // Ask to exit app
        Alert.alert(
          'Exit Nirvagi',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [atRootPage]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > 50 && headerVisible) {
      setHeaderVisible(false);
    } else if (offsetY <= 50 && !headerVisible) {
      setHeaderVisible(true);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setAtRootPage(!navState.canGoBack);
  };

  return (
    <SafeAreaView style={[styles.flex, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      
      {/* Custom Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }], opacity: headerVisible ? 1 : 0 }]}>
        <Text style={styles.headerText}>Nirvagi</Text>
      </Animated.View>
      
      {/* WebView */}
      <View style={[styles.flex, styles.webViewContainer]}>
        <WebView 
          ref={webViewRef}
          source={{ uri: 'https://nirvagi-demo.tarcinrobotic.in' }} 
          style={styles.flex}
          javaScriptEnabled={true} 
          onScroll={handleScroll}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#082444',
  },
  webViewContainer: {
    marginTop: 40, // Adjust marginTop to match header height
  },
});

export default App;
