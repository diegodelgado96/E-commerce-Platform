const AWS = require('aws-sdk');

process.env.AWS_ACCESS_KEY_ID = 'dev123456';
process.env.AWS_SECRET_ACCESS_KEY = 'dev123456';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getProducts = async () => {
    const params = {
        TableName: 'Products' 
    };

    try {
        //const data = await dynamoDB.scan(params).promise()
        const data = {Items: [
            {
              "Item": {
                "ProductId": "1",
                "Name": "Product 1",
                "Description": "Description of Product 1 ",
                "Price": 20.99,
                "Stock": 50
              }
            },
            {
              "Item": {
                "ProductId": "2",
                "Name": "Product 2",
                "Description": "Description of Product 2 ",
                "Price": 25.99,
                "Stock": 25
              }
            },
            {
              "Item": {
                "ProductId": "3",
                "Name": "Product 3",
                "Description": "Description of Product 3 ",
                "Price": 30.99,
                "Stock": 12
              }
            },
            {
              "Item": {
                "ProductId": "4",
                "Name": "Product 4",
                "Description": "Description of Product 4 ",
                "Price": 35.99,
                "Stock": 6
              }
            },
            {
              "Item": {
                "ProductId": "5",
                "Name": "Product 5",
                "Description": "Description of Product 5 ",
                "Price": 40.99,
                "Stock": 3
              }
            }
          ]}
        return data.Items
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
};


exports.handler = async (event) => {
    try {
        let products = {}
        if( event.httpMethod=='GET' )
        {
            products = await getProducts()
        }
        return {
            statusCode: 200,
            body: JSON.stringify({products})
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error})
        };
    }
};