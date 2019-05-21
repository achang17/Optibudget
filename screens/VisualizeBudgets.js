import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import { Grid, PieChart, StackedBarChart, XAxis, YAxis } from 'react-native-svg-charts';
import DonutPie from 'react-native-pie';
import * as scale from 'd3-scale';


export default class VisualizeBudgets extends React.Component {

    constructor(props) {
        super(props);
    }

    getPercent() {
        const category = this.props.navigation.getParam("category");
        const data = this.props.navigation.getParam("data");
        if (category === "Groceries") {
            console.log((data.groceriesTotal/data.groceriesBudget)*100);
            return parseFloat(((data.groceriesTotal/data.groceriesBudget)*100).toFixed(2));
        } else if (category === "Bills") {
            console.log((data.billsTotal/data.billsBudget)*100);
            return parseFloat(((data.billsTotal/data.billsBudget)*100).toFixed(2));
        } else if (category === "Shopping") {
            console.log((data.shoppingTotal/data.shoppingBudget)*100);
            return parseFloat(((data.shoppingTotal/data.shoppingBudget)*100).toFixed(2));
        } else if (category === "Dining Out") {
            console.log((data.diningOutTotal/data.diningOutBudget)*100);
            return parseFloat(((data.diningOutTotal/data.diningOutBudget)*100).toFixed(2));
        } else {
            return 0;
        }
    }

    getBudgetPercent() {
        const category = this.props.navigation.getParam("category");
        const data = this.props.navigation.getParam("data");
        if (category === "Groceries") {
            console.log((data.groceriesBudget/data.overalllBudget)*100);
            return parseFloat(((data.groceriesBudget/data.overallBudget)*100).toFixed(2));
        } else if (category === "Bills") {
            console.log((data.billsTotal/data.billsBudget)*100);
            return parseFloat(((data.billsBudget/data.overallBudget)*100).toFixed(2));
        } else if (category === "Shopping") {
            console.log((data.shoppingTotal/data.shoppingBudget)*100);
            return parseFloat(((data.shoppingBudget/data.overallBudget)*100).toFixed(2));
        } else if (category === "Dining Out") {
            console.log((data.diningOutTotal/data.diningOutBudget)*100);
            return parseFloat(((data.diningOutBudget/data.overallBudget)*100).toFixed(2));
        } else {
            return 0;
        }
    }

    getColor = (num) => {
        if (num >= 75) {
            return '#ff5050';
        } else {
            return '#26734d';
        }
    };


    render() {

        // const colors = ['#26734d', '#53c68c', '#8cd9b3', '#79d2a6',
        //     '#00b3b3', '#4dffff', '#33ffff', '#99ffff',
        //     '#7300e6', '#8c1aff', '#b366ff', '#cc99ff',
        //     '#e60099', '#ff33bb', '#ff66cc', '#ff99dd',];

        const data = this.props.navigation.getParam("data", []);
        {console.log(data)}

        const category = this.props.navigation.getParam("category", "");
        const pieChartData = [
            {
                key: 1,
                value: (data.groceriesBudget/data.overallBudget)*100,
                svg: { fill: '#600080' },
                arc: category === "Groceries" ? { outerRadius: '130%', cornerRadius: 10,} : {},
                label: (data.groceriesBudget/data.overallBudget)*100,
            },
            {
                key: 2,
                value: (data.billsBudget/data.overallBudget)*100,
                svg: { fill: '#9900cc' },
                arc: category === "Bills" ? { outerRadius: '130%', cornerRadius: 10,} : {},
            },
            {
                key: 3,
                value: (data.diningOutBudget/data.overallBudget)*100,
                svg: { fill: '#600080' },
                arc: category === "Dining Out" ? { outerRadius: '130%', cornerRadius: 10,} : {},
            },
            {
                key: 4,
                value: (data.shoppingBudget/data.overallBudget)*100,
                svg: { fill: '#9900cc' },
                arc: category === "Shopping" ? { outerRadius: '130%', cornerRadius: 10,} : {},
            },
        ];

        const StackedBarChartData = [
            {
                label: 'Groceries',
                groceriesBudget: data.groceriesBudget,
                groceriesTotal: data.groceriesTotal,
                billsBudget: 0,
                billsTotal: 0,
                shoppingBudget: 0,
                shoppingTotal: 0,
                diningOutBudget: 0,
                diningOutTotal: 0,
            },
            {
                label: 'Bills',
                groceriesBudget: 0,
                groceriesTotal: 0,
                billsBudget: data.billsBudget,
                billsTotal: data.billsTotal,
                shoppingBudget: 0,
                shoppingTotal: 0,
                diningOutBudget: 0,
                diningOutTotal: 0,
            },
            {
                label: 'Shopping',
                groceriesBudget: 0,
                groceriesTotal: 0,
                billsBudget: 0,
                billsTotal: 0,
                shoppingBudget: data.shoppingBudget,
                shoppingTotal: data.shoppingTotal,
                diningOutBudget: 0,
                diningOutTotal: 0,
            },
            {
                label: 'Dining',
                groceriesBudget: 0,
                groceriesTotal: 0,
                billsBudget: 0,
                billsTotal: 0,
                shoppingBudget: 0,
                shoppingTotal: 0,
                diningOutBudget: data.diningOutBudget,
                diningOutTotal: data.diningOutTotal,
            },
        ];

        const keys   = [ 'groceriesBudget', 'groceriesTotal','billsBudget', 'billsTotal', 'shoppingBudget', 'shoppingTotal', 'diningOutBudget','diningOutTotal' ];

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{justifyContent: 'center', alignItems: 'center',}}>
                        <Text style={styles.header}> {this.props.navigation.getParam("category", "Overall")} Summary </Text>
                    </View>

                    <View style={{backgroundColor: "white", paddingHorizontal: 10, borderRadius: 15, marginTop: 15}}>
                        <View style={styles.center}>
                            <Text style={{marginTop: 5,}}> {category} is <Text style={{fontSize: 15, fontWeight: 'bold'}}>{this.getBudgetPercent()}%</Text> of your overall budget. </Text>
                        </View>
                        <View style={{flex: 1,}}>
                            <PieChart
                                style={{height: 400}}
                                outerRadius={125}
                                innerRadius={10}
                                data={pieChartData}
                            />
                        </View>
                    </View>

                    <View style={{backgroundColor: "white", paddingHorizontal: 10, borderRadius: 15, marginTop: 15}}>
                        <View style={styles.center}>
                            <Text style={{marginTop: 5,}}> Here are your <Text style={{fontSize: 15, fontWeight: 'bold'}}>Spending Total v.s. Spending Budget</Text> by category. </Text>
                        </View>

                        <View>
                            <YAxis
                                data={StackedBarChartData}
                                style={{ marginBottom: 10 }}
                                contentInset={{ top: 10, bottom: 10 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                            />
                            <StackedBarChart
                                style={ { height: 350 } }
                                keys={ keys }
                                colors={ ['#862d59', '#d279a6','#862d59', '#d279a6','#862d59', '#d279a6','#862d59', '#d279a6'] }
                                data={ StackedBarChartData }
                                showGrid={ true }
                                contentInset={ { top: 30, bottom: 30 } }
                            >
                                <Grid direction={Grid.Direction.HORIZONTAL}/>
                            </StackedBarChart>
                            <XAxis
                                style={{ marginTop: 10 }}
                                data={ StackedBarChartData }
                                scale={scale.scaleBand}
                                formatLabel={ (value, index) => StackedBarChartData[index].label }
                                labelStyle={ { color: 'black' } }
                            />
                        </View>
                    </View>

                    <View style={{backgroundColor: "white", paddingHorizontal: 10, borderRadius: 15, marginTop: 15}}>
                        <View style={styles.center}>
                            <Text style={{marginTop: 5,}}> You have spent <Text style={{fontSize: 15, fontWeight: 'bold'}}>{this.getPercent()}%</Text> of your monthly budget for {category.toLowerCase()}. </Text>
                        </View>

                        <View style={styles.pieChart}>
                            <DonutPie
                                radius={125}
                                innerRadius={115}
                                series={[this.getPercent()]}
                                colors={[this.getColor(this.getPercent())]}
                                backgroundColor="#ddd"
                            />
                            <View style={styles.gauge}>
                                <Text style={styles.gaugeText}> {this.getPercent()}% </Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 235, 153, 0.5)',
        borderColor: 'black',
    },
    pieChart: {
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        flex: 1,
    },
    gauge: {
        position: 'absolute',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
    },
});