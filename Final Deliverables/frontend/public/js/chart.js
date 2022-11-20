import { user } from "./modules/user_data.js";

let isAlreadyLoaded = false;
let myChart;

const calculateTotalExpense = () => {
    const expenseData = user.getData('expenseData');
    const totalSpend = expenseData.reduce((prev, curr) => {
        if(! prev[curr['LABEL']]){
            prev[curr['LABEL']] = 0;
        }
        const amount = Number(curr['AMOUNT']);
        prev[curr['LABEL']] += curr['IS_INCOME'] ? -amount : amount;
        return prev;
    }, {})
    Object.entries(totalSpend).forEach(value => {
        if(value[1] <= 0){
            delete totalSpend[value[0]];
        }
    })
    return totalSpend;
}

const createLabel = (totalSpend) => {
    const label = Object.entries(totalSpend).map(value => {
        const str = `${value[0]}\nRs. ${value[1]}`
        return str;
    });
    return label;
}

export const loadChart = async () => {
    if(isAlreadyLoaded){
        myChart.destroy();
    }
    isAlreadyLoaded = true;
    const totalSpend = calculateTotalExpense();
    var data = [{
        data: Object.values(totalSpend),
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 59, 164, 0.2)',
            'rgba(55, 99, 132, 0.2)',
            'rgba(153, 2, 255, 0.2)',
            'rgba(235, 10, 55, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 59, 164, 1)',
            'rgba(55, 99, 132, 1)',
            'rgba(153, 2, 255, 1)',
            'rgba(235, 10, 55, 1)',
        ],
        borderWidth: 1
    }];

    var ctx = document.getElementById("myChart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: createLabel(totalSpend),
            datasets: data
        }
    });



}

