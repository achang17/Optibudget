import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddSpendingScreen';
import ViewScreen from '../screens/ViewSpendingScreen';
import AddModal from '../screens/AddModal';
import AddPhotoEntryModal from '../screens/AddPhotoEntryModal';
import GoalsScreen from '../screens/BudgetGoalsScreen';
import EditGoalsScreen from '../screens/EditBudgetModal';
import BudgetVisuals from '../screens/VisualizeBudgets';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  //BudgetVisuals: BudgetVisuals,

});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home`
          : 'md-home'
      }
    />
  ),
};

const AddStack = createStackNavigator({
  AddSpending: AddScreen,
  AddModal: AddModal,
  AddPhotoEntryModal: AddPhotoEntryModal,
});

AddStack.navigationOptions = {
  tabBarLabel: 'Add Spending',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
    />
  ),
};

const ViewStack = createStackNavigator({
  ViewSpending: ViewScreen,
});

ViewStack.navigationOptions = {
  tabBarLabel: 'View History',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-timer' : 'md-timer'}
    />
  ),
};

const GoalsStack = createStackNavigator({
  Goals: GoalsScreen,
  EditGoals: EditGoalsScreen,
  BudgetVisuals: BudgetVisuals,
});

GoalsStack.navigationOptions = {
  tabBarLabel: 'Goals',
  tabBarIcon: ({ focused }) => (
      <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
                ? `ios-stats`
                : 'md-stats'
          }
      />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  AddStack,
  ViewStack,
  GoalsStack,
});
