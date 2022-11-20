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
        data.splitData = calculateBalanceForLabel(split_data, balance_data);
    }

    const calculateBalanceForLabel = (split_data, balance_data=false) => {
        if(balance_data){
            balance_data.forEach(bal_data => {
                data.balanceEachMap[bal_data['LABEL']] = +bal_data['BALANCE']
            })
        }
        return split_data.map((each_data) => {
            let balance = Number(each_data['AMOUNT']);
            if (Object.keys(data.balanceEachMap).length !== 0){
                balance = 0;
                const spentAmout = data.balanceEachMap[each_data['LABEL']] ? data.balanceEachMap[each_data['LABEL']] : 0;
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