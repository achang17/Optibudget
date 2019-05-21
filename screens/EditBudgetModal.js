import React from 'react';
import {AsyncStorage, ScrollView, StyleSheet, TextInput, Text, View, Image, Button,} from 'react-native';

export default class EditBudgetModal extends React.Component {

    constructor() {
        super();

        this.state = {
            text: "",
        }
    }

    handleGoBack = async () => {
        let budget = parseFloat(this.state.text);
        await this.handleStorage(budget);

        this.props.navigation.state.params.budget(budget);
        this.props.navigation.goBack();
    };

    handleDelete = async () => {
        console.log("-------PRINTING KEYS BEFORE DELETE-------------");

        try {
            await AsyncStorage.removeItem('budgetGoals-data');
            console.log("-------PRINTING KEYS AFTER DELETE-------------");
            const keysAfterDelete = await AsyncStorage.getItem('budgetGoals-data');
            console.log(keyAfterDelete);
            return true;
        }
        catch(exception) {
            return false;
        }

    };

    handleStorage = async (budget) => {

        try {
            let savedBudgetGoals = await AsyncStorage.getItem("budgetGoals-data");
            console.log("---------Budget Goals already saved in AsyncStorage----------------");
            console.log(savedBudgetGoals);

            let newBudgets;
            if (!savedBudgetGoals) {
                console.log("--------IN IF OF HANDLESTORAGE EDITBUDGETMODAL.JS-----------");
                console.log("we are editing the budget for this category: ");
                console.log(this.props.navigation.getParam("type"));
                console.log(JSON.stringify({category: this.props.navigation.getParam("category"), budget: budget}));

                newBudgets = [{category: this.props.navigation.getParam("category", ""), budget: budget}, {category: "BudgetTotal", budget: budget}];

            } else {
                const existingBudgetGoals = JSON.parse(savedBudgetGoals);
                console.log("-------LOGGING BUDGET GOALS ALREADY IN ASYNCSTORAGE line 36-----------");
                console.log(existingBudgetGoals);

                for (var idx=0; idx < existingBudgetGoals.length; idx++) {
                    let curr_budget = existingBudgetGoals[idx];
                    console.log(curr_budget.category);

                    if(curr_budget.category === this.props.navigation.getParam("category", "")) {
                        existingBudgetGoals[1].budget -= curr_budget.budget;
                        existingBudgetGoals[1].budget += budget;
                        curr_budget.budget = budget;
                        break;
                    } else if (idx === existingBudgetGoals.length-1) {
                        existingBudgetGoals.push({category: this.props.navigation.getParam("category"), budget: budget});
                    }
                    console.log(idx);
                }

                //existingBudgetGoals.push({category: this.props.navigation.getParam("category"), budget: budget});
                newBudgets = existingBudgetGoals;
            }

            console.log(newBudgets);
            await AsyncStorage.setItem('budgetGoals-data', JSON.stringify(newBudgets));


        } catch(e) {
            console.log("Error in handleStorage() in EditBudgetModal.js");
            console.log(e);
        }

        console.log('Done with handleStorage() in EditBudgetModal');
    };


    render() {
        return(
            <View style={styles.container}>
                <View style={{backgroundColor: 'white', borderRadius: 15, flexWrap: 'wrap', marginTop: 15, }}>
                    <Text style={styles.instructionsText}> You are editing your budget for <Text style={{fontWeight: 'bold',}}>{this.props.navigation.getParam("category", "")}</Text>: </Text>
                    <View style={{paddingHorizontal: 10,}}>
                        <TextInput
                            style={styles.textInput}
                            keyboardType="numeric"
                            onChangeText={(text) => this.setState({text})}
                            placeholder="Input your budget here"
                            value={this.state.text}
                        />
                    </View>
                    <View style={styles.button}>
                    <Button color="white"
                            title="Save"
                            onPress={() => this.handleGoBack()}/>

                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 235, 153, 0.5)',
        borderColor: 'black',
    },
    button: {
        backgroundColor: 'cadetblue',//'rgb(255, 204, 0)',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    textInput: {
        height: 40,
        borderColor: 'silver',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal:10,
        marginTop: 10,
    },
    instructionsText : {
        fontSize: 15,
        paddingHorizontal: 10,
        marginTop: 20,
    },
});
