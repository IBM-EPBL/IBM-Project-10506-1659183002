const User = () => {
    const data = {}
    data.balanceEachMap = {};

    const resetData = () => {
        data.username = "username";
        data.totalAmount = 0;
        data.timestamp = 0;
        data.balance = 0;
        data.alert = 0;
        data.is_send = false;
        data.splitData = [];
        data.balanceEachMap = {};
    }

    const setInitial= (username, userData, split_data, balance_data, expense_data) => {
        data.username = username;
        data.totalAmount = +userData["TOTAL_AMOUNT"];
        data.alert = +userData["ALERT"];
        data.is_send = userData["IS_SEND"];
        data.timestamp = userData["TIMESTAMP"];
        data.expenseData = expense_data;
        const total_spend = expense_data.reduce((total, eachData) => {
            total = eachData['IS_INCOME'] ? total + Number(eachData['AMOUNT']) : total - Number(eachData['AMOUNT']);
            return total;
        }, 0);
        data.balance = data.totalAmount + total_spend;
        //console.log(calculateBalanceForLabel(split_data, balance_data))
        data.splitData = calculateBalanceForLabel(split_data, balance_data);
        //console.log(data.splitData)
    }

    const calculateBalanceForLabel = (split_data, balance_data=false) => {
        //console.log(data.balanceEachMap, balance_data)
        if(balance_data){
            balance_data.forEach(bal_data => {
                //console.log(data.balanceEachMap);
                data.balanceEachMap[bal_data['LABEL']] = +bal_data['BALANCE']
            })
        }
        //console.log(data.balanceEachMap);
        return split_data.map((each_data) => {
            //console.log(data, data.balanceEachMap[data['LABEL']] ? data.balanceEachMap[data['LABEL']] : 0)
            let balance = Number(each_data['AMOUNT']);
            //console.log(Object.keys(data.balanceEachMap))
            if (Object.keys(data.balanceEachMap).length !== 0){
                balance = 0;
                const spentAmout = data.balanceEachMap[each_data['LABEL']] ? data.balanceEachMap[each_data['LABEL']] : 0;
                //console.log(spentAmout);
                const totalAmount = Number(each_data['AMOUNT']);
                balance = totalAmount + spentAmout;
            }
            return {...each_data, balance:balance}
        });
    }

    const getData = (field) => data[field];
    const setData = (field,value) => {
        data[field] = value
    }
    const setSplitData = (split_data, balance_data) => data.splitData = calculateBalanceForLabel(split_data, balance_data)
    const updateSplitData = (newData) => {
        let isUpdated = false;
        data.splitData.forEach(data => {
            if(isUpdated){
                return;
            }
            if(data['LABEL'] === newData.label){
                data['AMOUNT'] = Number(data['AMOUNT']) + Number(newData.amount);
                isUpdated = true;
            }
        })
        if(!isUpdated){
            data.splitData.push({LABEL: newData.label, AMOUNT: newData.amount});
        }
        setSplitData(data.splitData);
    }
    const removeSplitData = (deleteDataLabel) => {
        data.splitData = data.splitData.filter(sp_data => sp_data['LABEL'] !== deleteDataLabel);
        //console.log(data.splitData);
    }

    const updateUserExpenseData = (expenseData) => {
        const newData = {
            LABEL: expenseData.label,
            AMOUNT: expenseData.amount,
            IS_INCOME: expenseData.is_income,
            TIMESTAMP: expenseData.timestamp
        }
        data.expenseData.unshift(newData);
        data.balance += expenseData.is_income ? expenseData.amount : -expenseData.amount;

    }

    return {setInitial, getData, setData, setSplitData, updateSplitData, removeSplitData, updateUserExpenseData, resetData }
}

export const user = User();