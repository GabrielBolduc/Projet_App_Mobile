import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


import { AuthProvider } from './context/AuthContext';


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

const PRIMARY_COLOR = '#4A6572';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); 

function MyTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabContainer, { paddingBottom: insets.bottom }]}>
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
            <Ionicons name={iconName} size={24} color={isFocused ? PRIMARY_COLOR : '#888'} />
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

export default function App() {
  return (
    // ON ENVELOPPE TOUTE L'APP AVEC LE PROVIDER
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
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
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});