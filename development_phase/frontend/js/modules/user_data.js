const User = () => {
    const data = {}
    data.balanceEachMap = {};

    const setInitial= (username, userData, split_data, balance_data) => {
        data.username = username;
        data.totalAmount = +userData["TOTAL_AMOUNT"];
        data.timestamp = userData["FROM_TIMESTAMP"];
        let total_spend = 0;
        // data.expense = userData.map(data => {
        //     total_spend = data["IS_INCOME"] ? total_spend - (+data["AMOUNT"]) : total_spend + (+data["AMOUNT"]);
        //     return {id: data.ID, amount: +data.AMOUNT, is_income: data["IS_INCOME"], label: data.LABEL, timestamp: data.TIMESTAMP}
        // })
        // console.log(data.totalAmount, total_spend);
        // console.log(data.expense);
        data.balance = data.totalAmount - total_spend;
        console.log(calculateBalanceForLabel(split_data, balance_data))
        data.splitData = calculateBalanceForLabel(split_data, balance_data);
        console.log(data.splitData)
    }

    const calculateBalanceForLabel = (split_data, balance_data=false) => {
        console.log(data.balanceEachMap, balance_data)
        if(balance_data){
            balance_data.forEach(bal_data => {
                console.log(data.balanceEachMap);
                data.balanceEachMap[bal_data['LABEL']] = +bal_data['BALANCE']
            })
        }
        console.log(data.balanceEachMap);
        return split_data.map((each_data) => {
            // console.log(data, data.balanceEachMap[data['LABEL']] ? data.balanceEachMap[data['LABEL']] : 0)
            let balance = 0;
            console.log(Object.keys(data.balanceEachMap))
            if (Object.keys(data.balanceEachMap).length !== 0){
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
        console.log(data.splitData);
    }

    return {setInitial, getData, setData, setSplitData, updateSplitData, removeSplitData }
}

export const user = User();