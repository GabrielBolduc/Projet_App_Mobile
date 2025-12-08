import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './context/authContext'; // Import useAuth

import Feed from './feed/feed_screen';
import MyRatings from './ratings/myRatings_screen';
import Settings from './settings/settings_screen';
import RateMovieScreen from './ratings/rateMovie_screen'; 
import MovieList from './movie/movieList_screen'
import FollowScreen from './follows/follow_screen'
import Recommendation from './recommendations/recommendation_screen';
import AddFollower from './follows/addFollower_screen';
import AddRecommendation from './recommendations/addRecommendation_screen';
import Login from './auth/login_screen'
import Signup from './auth/signup_screen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); 

// Composant Barre de Navigation Personnalisée (Adapté au thème)
function MyTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { theme } = useAuth(); // Récupère le thème global

  return (
    <View style={[styles.tabContainer, { paddingBottom: insets.bottom, backgroundColor: theme.card, borderTopColor: theme.border }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        let iconName;
        if (route.name === 'Feed') iconName = isFocused ? 'home' : 'home-outline';
        else if (route.name === 'Mes ratings') iconName = isFocused ? 'star' : 'star-outline';
        else if (route.name === 'Mes amis') iconName = isFocused ? 'people' : 'people-outline';
        else if (route.name === 'Recommandation') iconName = isFocused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
        else if (route.name === 'Settings') iconName = isFocused ? 'settings' : 'settings-outline';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? theme.primary : theme.subText} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Mes ratings" component={MyRatings} />
      <Tab.Screen name="Mes amis" component={FollowScreen} />
      <Tab.Screen name="Recommandation" component={Recommendation} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

// Composant principal qui contient la Navigation
function AppContent() {
    const { theme } = useAuth();

    // Création d'un thème compatible React Navigation
    const MyNavigationTheme = {
        dark: theme.dark,
        colors: {
            primary: theme.primary,
            background: theme.background,
            card: theme.card,
            text: theme.text,
            border: theme.border,
            notification: theme.danger,
        },
    };

    return (
        <NavigationContainer theme={MyNavigationTheme}>
            <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
            <Stack.Navigator 
                screenOptions={{ headerShown: false }}
                initialRouteName='Login'
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Home" component={HomeTabs} />
                
                {/* Modal et autres écrans */}
                <Stack.Screen 
                    name="RateMovie" 
                    component={RateMovieScreen} 
                    options={{ presentation: 'modal' }}
                />
                <Stack.Screen name="MovieList" component={MovieList} />
                <Stack.Screen name="AddFollower" component={AddFollower} />
                <Stack.Screen name="AddRecommendation" component={AddRecommendation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
         <AppContent />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});