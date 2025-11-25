import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Login from './login_screen';
import Signup from './signup_screen';
import Follow from './follow_screen';
import Recommandation from './recommendation_screen';

import AddRecommendation from './addRecommendation_screen';
import AddFollower from './addFollower_screen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PRIMARY_COLOR = '#4A6572';

function MyTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => navigation.replace('Login')}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="log-out-outline" size={26} color="#D32F2F" />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Recommendations') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Recommendations" 
        component={Recommandation} 
        options={{ title: 'Recommandations' }} 
      />
      <Tab.Screen 
        name="Friends" 
        component={Follow} 
        options={{ title: 'Amis' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ 
            title: '', 
            headerTransparent: true, 
            headerTintColor: PRIMARY_COLOR 
          }} 
        />

        <Stack.Screen 
          name="Home" 
          component={MyTabs} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AddRecommendation" 
          component={AddRecommendation} 
          options={{ title: 'Nouvelle recommandation', headerTintColor: PRIMARY_COLOR }} 
        />
        <Stack.Screen 
          name="AddFollower" 
          component={AddFollower} 
          options={{ title: 'Ajouter un ami', headerTintColor: PRIMARY_COLOR }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
  );
}