const User = () => {
    const data = {}

    const setInitial= (username, total_amount, split_data) => {
        data.username = username;
        data.totalAmount = total_amount;
        data.balance = total_amount;
        data.splitData = split_data;
    }

    const getData = (field) => data[field];
    const setData = (field,value) => {
        data[field] = value
    }
    return {setInitial, getData, setData }
}

export const user = User();