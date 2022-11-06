const User = () => {
    const data = {}

    const setInitial= (username, userData, split_data) => {
        data.username = username;
        data.totalAmount = userData["TOTAL_AMOUNT"];
        data.timestamp = userData["TIMESTAMP"]
        data.balance = data.totalAmount;
        console.log(split_data)
        data.splitData = split_data;
    }

    const getData = (field) => data[field];
    const setData = (field,value) => {
        data[field] = value
    }
    return {setInitial, getData, setData }
}

export const user = User();