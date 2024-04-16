import json
import boto3

dynamodb = boto3.client('dynamodb', endpoint_url='http://localhost:4566')

data = { 
    "orders":
    [
        {
            "order_id": "001",
            "customer_id": "C001",
            "product_id": "P001",
            "quantity": 2,
            "total_price": 50.00
        },
        {
            "order_id": "002",
            "customer_id": "C002",
            "product_id": "P002",
            "quantity": 1,
            "total_price": 30.00
        },
        {
            "order_id": "003",
            "customer_id": "C003",
            "product_id": "P003",
            "quantity": 3,
            "total_price": 80.00
        },
        {
            "order_id": "004",
            "customer_id": "C001",
            "product_id": "P002",
            "quantity": 1,
            "total_price": 30.00
        },
        {
            "order_id": "005",
            "customer_id": "C002",
            "product_id": "P001",
            "quantity": 4,
            "total_price": 100.00
        }
    ]
}

def get_orders():
    try:
        table_name = 'Orders'

        params = {
            'TableName': table_name
        }

        response = dynamodb.scan(**params)
        orders = response.get('Items', [])

        orders_json = [json.loads(order) for order in orders]

        return orders_json
    except Exception as e:
        print(f'Error al obtener órdenes: {e}')
        raise e


def lambda_handler(event, context):
    try:
        #orders = get_orders()

        return {
            'statusCode': 200,
            'body': json.dumps(data)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
