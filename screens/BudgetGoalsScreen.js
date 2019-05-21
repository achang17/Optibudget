import React from 'react';
import {ProgressViewIOS, ScrollView, StyleSheet, TouchableOpacity, Text, View, Image, Button, AsyncStorage,} from 'react-native';
import {NavigationEvents} from "react-navigation";

export default class BudgetGoalsScreen extends React.Component {
    static navigationOptions = {
        title: 'Your Budget Goals',
    };

    constructor() {
        super();

        this.state = {
            groceriesBudget: null,
            billsBudget: null,
            shoppingBudget: null,
            diningOutBudget: null,
            groceriesTotal: null,
            billsTotal: null,
            shoppingTotal: null,
            diningOutTotal: null,
            overallBudget: null,
            overallTotal: null,
        };
    }

    handleUpdateOverallBudget = async (budget) => {
        const overallBudget = this.state.overallBudget + budget;

        await this.setState({overallBudget: overallBudget});
    };

    handleUpdateGroceriesBudget = async (budget) => {
        budget = parseFloat (budget);

        await this.handleUpdateOverallBudget(budget);
        await this.setState({groceriesBudget: budget,});
    };

    handleUpdateBillsBudget = async (budget) => {
        budget = parseFloat (budget);

        await this.handleUpdateOverallBudget(budget);
        await this.setState({billsBudget: budget,});
    };

    handleUpdateShoppingBudget = async (budget) => {
        budget = parseFloat (budget);

        await this.handleUpdateOverallBudget(budget);
        await this.setState({shoppingBudget: budget,});
    };

    handleUpdateDiningOutBudget = async (budget) => {
        budget = parseFloat (budget);

        await this.handleUpdateOverallBudget(budget);
        await this.setState({diningOutBudget: budget,});
    };

    handleLoadExistingBudgetGoals = async () => {
        console.log("in getAllStoredData in BudgetGoalsScreen.js Line 18");

        try {
            let data = await AsyncStorage.getItem("budgetGoals-data");
            data = JSON.parse(data);

            console.log("BUDGET GOALS DATA");
            console.log(data);

            for (var idx = 0; idx < data.length; idx++) {
                let curr = data[idx];
                console.log(curr);
                if (curr.category === "groceries") {
                    await this.setState({groceriesBudget: curr.budget});
                    //console.log(this.state.groceriesBudget);
                } else if (curr.category === "bills") {
                    await this.setState({billsBudget: curr.budget});
                    //console.log(this.state.billsBudget);
                } else if (curr.category === "shopping") {
                    await this.setState({shoppingBudget: curr.budget});
                    //console.log(this.state.shoppingBudget);
                } else if (curr.category === "dining out") {
                    await this.setState({diningOutBudget: curr.budget});
                    //console.log(this.state.diningOutBudget);
                } else if (curr.category == "BudgetTotal") {
                    await this.setState({overallBudget: curr.budget});
                }
            }

        }
        catch(e) {
            console.log(e);
        }

    };

    handleNavigationEvent = async () => {
        await this.handleLoadExistingBudgetGoals();
        await this.handleSumSpendingsByCategory();
    };

    handleSumSpendingsByCategory = async () => {
        console.log("in handleSumSpendings in BudgetGoalsScreen.js Line 82");

        try {
            let data = await AsyncStorage.getItem("spendings-data");
            data = JSON.parse(data);

            console.log("----------------SPENDINGS DATA---------------");
            console.log(data);

            let groceries = 0;
            let bills = 0;
            let shopping = 0;
            let diningOut = 0;
            let overall = 0;

            for (var idx = 0; idx < data.length; idx++) {
                let curr = data[idx];
                console.log(curr);
                let amount = parseFloat(curr.amount);

                overall += amount;
                if (curr.category === "Groceries") {
                    groceries += amount;
                    // await this.setState({groceriesBudget: curr.budget});
                    //console.log(this.state.groceriesBudget);
                } else if (curr.category === "Bills") {
                    bills += amount;
                    // await this.setState({billsBudget: curr.budget});
                    //console.log(this.state.billsBudget);
                } else if (curr.category === "Shopping") {
                    shopping += amount;
                    // await this.setState({shoppingBudget: curr.budget});
                    //console.log(this.state.shoppingBudget);
                } else if (curr.category === "Dining Out") {
                    diningOut += amount;
                    // await this.setState({diningOutBudget: curr.budget});
                    //console.log(this.state.diningOutBudget);
                }
            }

            await this.setState({
                groceriesTotal: groceries.toFixed(2),
                billsTotal: bills.toFixed(2),
                shoppingTotal: shopping.toFixed(2),
                diningOutTotal: diningOut.toFixed(2),
                overallTotal: overall.toFixed(2),
            })

        }
        catch(e) {
            console.log(e);
        }


    };

    handleGetVisual= (category) => {
        if (category === "Groceries") {
            this.props.navigation.push('BudgetVisuals',
                { category: "Groceries",
                          groceriesBudget: this.state.groceriesBudget,
                          billsBudget: this.state.billsBudget,
                          shoppingBudget: this.state.shoppingBudget,
                          diningOutBudget: this.state.diningOutBudget,
                          groceriesTotal: this.state.groceriesTotal,
                });
        } else if (category === "Bills") {

        } else if (category === "Shopping") {

        } else if (category === "Dining Out") {

        }
    };

    getColor = (num) => {
        if (num >= 0.75) {
            return 'red';
        } else if (num >= 0.5) {
            return 'orange';
        } else {
            return 'limegreen';
        }
    };

    render() {
        console.log("---------------------LOGGING STATE------------------------------");
        console.log(this.state);

        return (
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between'}}>
                <NavigationEvents onWillFocus={(payload) => {this.handleNavigationEvent();}} />
                <View style={styles.container}>
                    <TouchableOpacity style={{paddingHorizontal: 5, backgroundColor: 'white', borderRadius: 15, flex: 1, marginTop: 15, marginBottom: 5, }}
                                      onPress={() => this.props.navigation.push('BudgetVisuals', {category: "Groceries", data: this.state})}>

                        <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 5,}}> Groceries </Text>
                        {this.state.groceriesBudget === null ? (<Text style={{fontSize: 10,}}> Your Budget: -- </Text>):(<Text style={{fontSize: 10,}}> Your Budget: ${this.state.groceriesBudget} </Text>) }
                        {this.state.groceriesBudget === null ? (<Text style={{fontSize: 10,}}> Your Spending: -- </Text>):(<Text style={{fontSize: 10,}}> Your Spending: ${this.state.groceriesTotal} </Text>) }

                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
                            <ProgressViewIOS style={styles.progressBar}
                                             progress={this.state.groceriesTotal/this.state.groceriesBudget}
                                             progressTintColor={this.getColor(this.state.groceriesTotal/this.groceriesBudget)}
                                             trackTintColor='gainsboro'/>
                        </View>


                        <View style={styles.button}>
                            <Button title="Edit Budget Goal"
                                    color="white"
                                    onPress={() => this.props.navigation.navigate('EditGoals', {budget: this.handleUpdateGroceriesBudget.bind(this), category: "groceries"})} />
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingHorizontal: 5, backgroundColor: 'white', borderRadius: 15, flex: 1, marginTop: 5, marginBottom: 5,}}
                                      onPress={() => this.props.navigation.push('BudgetVisuals', {category: "Bills", data: this.state})}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 5,}}> Bills </Text>
                        {this.state.billsBudget === null ? (<Text style={{fontSize: 10,}}> Your Budget: -- </Text>):(<Text style={{fontSize: 10,}}> Your Budget: ${this.state.billsBudget} </Text>) }
                        {this.state.billsTotal === null ? (<Text style={{fontSize: 10,}}> Your Spending: -- </Text>):(<Text style={{fontSize: 10,}}> Your Spending: ${this.state.billsTotal} </Text>) }

                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
                            <ProgressViewIOS style={styles.progressBar}
                                             progress={this.state.billsTotal/this.state.billsBudget}
                                             progressTintColor={this.getColor(this.state.billsTotal/this.state.billsBudget)}
                                             trackTintColor='gainsboro'/>
                        </View>

                        <View style={styles.button}>
                            <Button title="Edit Budget Goal"
                                    color="white"
                                    onPress={() => this.props.navigation.navigate('EditGoals', {budget: this.handleUpdateBillsBudget.bind(this), category: "bills"})} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingHorizontal: 5, backgroundColor: 'white', borderRadius: 15, flex: 1, marginTop: 5, marginBottom: 5,}}
                                      onPress={() => this.props.navigation.push('BudgetVisuals', {category: "Shopping", data: this.state})}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 5,}}> Shopping </Text>
                        {this.state.shoppingBudget === null ? (<Text style={{fontSize: 10,}}> Your Budget: -- </Text>):(<Text style={{fontSize: 10,}}> Your Budget: ${this.state.shoppingBudget} </Text>) }
                        {this.state.shoppingTotal === null ? (<Text style={{fontSize: 10,}}> Your Spending: -- </Text>):(<Text style={{fontSize: 10,}}> Your Spending: ${this.state.shoppingTotal} </Text>) }

                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
                            <ProgressViewIOS style={styles.progressBar}
                                             progress={this.state.shoppingTotal/this.state.shoppingBudget}
                                             progressTintColor={this.getColor(this.state.shoppingTotal/this.state.shoppingBudget)}
                                             trackTintColor='gainsboro'/>
                        </View>

                        <View style={styles.button}>
                            <Button title="Edit Budget Goal"
                                    color="white"
                                    onPress={() => this.props.navigation.navigate('EditGoals', {budget: this.handleUpdateShoppingBudget.bind(this), category: "shopping"})} />
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingHorizontal: 5, backgroundColor: 'white', borderRadius: 15, flex: 1, marginTop: 5, marginBottom: 5,}}
                                      onPress={() => this.props.navigation.push('BudgetVisuals', {category: "Dining Out", data: this.state})}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 5,}}> Dining out </Text>
                        {this.state.diningOutBudget === null ? (<Text style={{fontSize: 10,}}> Your Budget: -- </Text>):(<Text style={{fontSize: 10,}}> Your Budget: ${this.state.diningOutBudget} </Text>) }
                        {this.state.diningOutTotal === null ? (<Text style={{fontSize: 10,}}> Your Spending: -- </Text>):(<Text style={{fontSize: 10,}}> Your Spending: ${this.state.diningOutTotal} </Text>) }

                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
                            <ProgressViewIOS style={styles.progressBar}
                                             progress={this.state.diningOutTotal/this.state.diningOutBudget}
                                             progressTintColor={this.getColor(this.state.diningOutTotal/this.state.diningOutBudget)}
                                             trackTintColor='gainsboro'/>
                        </View>

                        <View style={styles.button}>
                            <Button title="Edit Budget Goal"
                                    color="white"
                                    onPress={() => this.props.navigation.navigate('EditGoals', {budget: this.handleUpdateDiningOutBudget.bind(this), category: "dining out"})} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 235, 153, 0.5)',
        borderColor: 'black',
    },
    button: {
        backgroundColor: 'cadetblue',//'rgb(255, 204, 0)',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'stretch',
    },
    progressBar: {
        width: 100,
        transform: [{ scaleX: 3.75 }, { scaleY: 5.0 }],
    },});
