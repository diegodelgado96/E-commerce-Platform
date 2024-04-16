# E-commerce-Platform

## 1. Platform architecture design

When designing your e-commerce platform architecture, consider using a combination of traditional microservices and serverless functions to take advantage of both approaches. Here is the high level architecture diagram:

![alt text](./docs/architecture.png)

This design allows for a scalable and modular architecture, where each component fulfills a specific function and can be developed, tested and deployed independently. The combination of microservices and serverless functions provides flexibility and efficiency in handling different parts of the platform. Additionally, utilizing AWS services such as API Gateway and Lambda facilitates scalability and deployment in the cloud.


## 2. cloud environment with localStack

To simulate the cloud environment according to the proposed architecture, we will use LocalStack, a tool that allows us to emulate AWS services locally. We will go step by step in the installation and configuration of these resources.

### Step by Step:

1. You must make sure you have docker and docker-compose installed. If you don't have it, you can use the following [link](https://imaginaformacion.com/tutoriales/que-es-docker-compose) to guide you through the installation. 

2. We will raise the docker-compose service, with the command 
    - *```docker-compose up```*  

3. We will generate a secret manager to provide security to our service, we will use the following command 
    - *```aws --endpoint-url http://localhost:4566 secretsmanager create-secret --name ecommerce-test```*.

    This command will generate an object similar to this 
    ``` 
    {
        "ARN": "arn:aws:secretsmanager:us-east-1:000000000000:secret:ecommerce-test-bToArr",
        "Name": "ecommerce-test"
    }
    ```

4. Before creating the lambda functions we must know the ARN of the role with which we will create the services we need. For this we will use the following command: 
    - ```aws iam get-role --role-name AWSServiceRoleForSupport  --query "Role.Arn" --output text ```

- This command will return something like this: 
    - **```arn:aws:iam::360853546345:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport```** 

  > **NOTE:** *Keep in mind that this arn is only an example, you must use the one that returns the execution of the command whenever the role is requested.*


5. Now we will create the lambda functions that will contain the functionalities of our services:

    - We will launch the product services with node.js in version 14 and configuration of the handler controller, which will be contained in the project's index.js.
        - ```aws --endpoint-url=http://localhost:4566 lambda create-function   --function-name ProductServiceLambda   --runtime nodejs14.x   --role arn:aws:iam::360853546345:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport   --handler index.handler   --zip-file "fileb://empty.zip" ```

   - Our next lambda function in charge of order services will be created for Python in version 3.8 and like the previous one, its execution will depend on the handler controller. 
        - ``` aws --endpoint-url=http://localhost:4566  lambda create-function     --function-name OrderServiceLambda     --runtime python3.8     --role arn:aws:iam::360853546345:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport    --handler lambda_function.lambda_handler     --zip-file fileb://empty.zip ```



6. We will create the API Gateway which will be the service to expose the lambda functions through the HTTP protocol and will be called 'ECommerceAPI'

    - ```aws --endpoint-url=http://localhost:4566 apigateway create-rest-api  --name "ECommerceAPI" --description "API for E-commerce platform"```

    This would return something similar to this:

    ```
    {
        "id": "7u5mpdhdj2",
        "name": "ECommerceAPI",
        "description": "API for E-commerce platform",
        "createdDate": "2024-04-15T12:02:45-05:00",
        "apiKeySource": "HEADER",
        "endpointConfiguration": {
            "types": [
                "EDGE"
            ]
        },
        "disableExecuteApiEndpoint": false
    }
    ```

    > **NOTE:** *In this case, the id '7u5mpdhdj2' must be taken into account, because it will be the parameter when rest-api-id is requested. In the case of parent-id we will obtain it with the following command:
    ```aws --endpoint-url=http://localhost:4566 apigateway get-resources --rest-api-id 7u5mpdhdj2``` which will give us as output the following ```
    {
        "items": [
            {
                "id": "a73drtiyzd",
                "path": "/"
            }
        ]
    }```*


1. Create the resource for the product catalog service with the following command.
    - ```aws --endpoint-url=http://localhost:4566 apigateway create-resource --rest-api-id 7u5mpdhdj2 --parent-id a73drtiyzd --path-part products```

    we will have an output like the following:

    ```
    {
        "id": "d8vvit8m2l",
        "parentId": "a73drtiyzd",
        "pathPart": "products",
        "path": "/products"
    }
    ```

    > We must take into account the id *'d8vvit8m2l'* because this will be the parameter for when resource-id is required for the product service.

1. Create the routes for the Product Catalog service using the following commands:
    - ```aws --endpoint-url=http://localhost:4566 apigateway put-method --rest-api-id 7u5mpdhdj2 --resource-id d8vvit8m2l --http-method GET --authorization-type NONE```

    - ```aws --endpoint-url=http://localhost:4566 apigateway put-integration --rest-api-id 7u5mpdhdj2 --resource-id d8vvit8m2l --http-method GET --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:localhost:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:ProductServiceLambda/invocations```

    - ```aws --endpoint-url=http://localhost:4566 apigateway put-method-response   --rest-api-id 7u5mpdhdj2   --resource-id d8vvit8m2l   --http-method GET   --status-code 200   --response-models "application/json=EMPTY"```

    - ```aws --endpoint-url=http://localhost:4566 apigateway put-integration-response --rest-api-id pfnnx967y3 --resource-id b92tpevorw --http-method GET --status-code 200 ```

1. Create the resource for the order management service.
    - ```aws --endpoint-url=http://localhost:4566 apigateway create-resource --rest-api-id 7u5mpdhdj2 --parent-id a73drtiyzd --path-part orders```

    we will have an output like the following:

    ```
    {
        "id": "tro1qvpsa2",
        "parentId": "a73drtiyzd",
        "pathPart": "orders",
        "path": "/orders"
    }
    ```

    > We must take into account the id *'tro1qvpsa2'* because this will be the parameter for when resource-id is required for the order service.

1. Create the routes for the order management service:
    - ```aws --endpoint-url=http://localhost:4566 apigateway put-method --rest-api-id 7u5mpdhdj2 --resource-id tro1qvpsa2 --http-method GET --authorization-type NONE```

    - ```aws --endpoint-url=http://localhost:4566 apigateway put-integration --rest-api-id 7u5mpdhdj2 --resource-id tro1qvpsa2 --http-method GET --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:localhost:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:OrderServiceLambda/invocations```

    - ```aws --endpoint-url=http://localhost:4566 apigateway put-method-response   --rest-api-id 7u5mpdhdj2   --resource-id tro1qvpsa2   --http-method GET   --status-code 200   --response-models "application/json=EMPTY"```

    - - ```aws --endpoint-url=http://localhost:4566 apigateway put-integration-response --rest-api-id pfnnx967y3 --resource-id pyvt9zvyhy --http-method GET --status-code 200 ```

1. Now we will expose the service to access the endpoints with the following command:

    ```aws --endpoint-url=http://localhost:4566 apigateway create-deployment --rest-api-id pfnnx967y3 --stage-name test```

    - The address to access the lambda function through the apigateway will be:
        > *http://localhost:4566/restapis/pfnnx967y3/test/_user_request_*
    
    - In the case of lambda functions we must add /products or /orders as needed.

        >*http://localhost:4566/restapis/pfnnx967y3/test/_user_request_/products*
        >*http://localhost:4566/restapis/pfnnx967y3/test/_user_request_/orders*

    > **NOTE:** keep in mind that 'pfnnx967y3' is the rest-api-id code 

1. Finally we will create the tables in dynamodb
    1. Create a table to store the products:
    
        - ```aws --endpoint-url http://localhost:4566 dynamodb create-table --table-name Products --attribute-definitions AttributeName=ProductId,AttributeType=S --key-schema AttributeName=ProductId,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5```

        This command creates a table named Products with a ProductId attribute as the primary hash key.

    1. Create a table to store orders:

        - ```aws --endpoint-url http://localhost:4566 dynamodb create-table --table-name Orders --attribute-definitions AttributeName=OrderId,AttributeType=S --key-schema AttributeName=OrderId,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5```

        This command creates a table called Orders with an OrderId attribute as the primary hash key.

## 3. CI/CD
The next section will explain how the pipeline was built that will allow us to do continuous integration and continuous deployment of the lambda function in charge of the products.

1. ```name: CI/CD for Product Service```
    - This is the name of the workflow. Helps identify the main purpose of the workflow.

1. 
    ```
    on:
        push:
            branches:
            - main
    ```

    - Defines the events that will trigger this workflow. In this case, the workflow will be activated when a push is made to the main branch.

1. 
    ```
    jobs:
        deploy:
            runs-on: ubuntu-latest
    ```
    - Defines a job called deploy that will run on the latest Ubuntu operating system.

1. ```
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
    ```
    - This step clones the GitHub repository to the workflow runtime.

1. ```
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
    ``` 
    - Configure the environment to run Node.js, setting the node to version 14.

1. ```
      - name: Install dependencies
        run: npm install
        working-directory: productService
    ```
    - Install the project dependencies using npm install in the product service directory.

1. ```
      - name: Build application
        run: npm run build
        working-directory: productService
    ```
    - Build the application by running npm run build in the product service directory.
1. ```
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: YOUR_AWS_REGION
    ```
    - Configure the AWS credentials required to interact with AWS services. The access keys are taken from the repository secrets.
1. ```
      - name: Package service
        run: zip -r productService.zip ./*
        working-directory: productService
    ```
    - Packages the product service into a zip file in the product service directory.

1. ```
      - name: Deploy to Lambda
        run: aws lambda update-function-code --function-name                ProductServiceLambda --zip-file fileb://productService.zip
    ```
    - Update the code of the lambda function called ProductServiceLambda with the zip file generated above.

## 4. Backend

Two services were developed that will be contained in the lambda functions, for products the lambda function will be developed in Nodejs and for orders it will be developed in Python.

### 1. ProductServiceLambda (Nodejs)
- To prepare the project and be deployed in the lambda function, we only need to execute the following commands.
    -  ```cd productService```
    -  ```npm run deploy```

    The first command will make sure that we stop at the folder that corresponds to the product service project and the second command will install the dependencies, prepare the .zip file to load into the lambda and finally it will load the lambda function and leave it ready to use .

### 2. OrderServiceLambda (Nodejs)
- To prepare the project and deploy it to the lambda function, we only need to run the following commands.

    - ```cd orderService```
    - ```pip install boto3```
    - ```Compress-Archive -Path lambda_function.py -DestinationPath 'orderService.zip' -force```
    - ```aws --endpoint-url=http://localhost:4566 lambda update-function-code --function-name OrderServiceLambda --zip-file fileb://orderService.zip```

    The first command will make sure that we stop at the folder that corresponds to the service project of the orders, the second command will install the boto3 library which will be used to connect and query dynamoDB tables, the third command will prepare the .zip file for load it into lambda and finally the lambda function is loaded and will leave it ready to use.

## 5. FrontEnd (Angular)

This front end was built with angular and angular material, to run the project, you just have to run these lines:

- ```cd Front-end ```
- ```npm install```
- ```npm run start```

The first command will help us get to the Angular project folder, then all the dependencies will be installed and finally we will run the project locally.


