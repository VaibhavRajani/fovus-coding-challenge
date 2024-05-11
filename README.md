## Fovus - AWS Coding Challenge (Vaibhav Rajani)

#### ✨ This project is designed to demonstrate a full-stack application using React for the frontend and AWS CDK for the backend. The application allows users to upload files and input text through a web interface, which then interacts with AWS services such as DynamoDB and S3 to store and manage data.

## Install

Start by cloning this repository.

> Configure backend

```sh
cd backend
npm i
cdk deploy
```

> Configure frontend

```sh
cd ..
npm install
npm run start
```

This will serve the application on http://localhost:3000.

👤 **AWS CLI configured with Administrator access**

Put this in your .env folder

```sh
REACT_APP_API_URL="https://22vd8pheqj.execute-api.us-east-2.amazonaws.com/prod"
```

## Amplify Link

The site is hosted on [amplify](https://dev.d23kam955crdjk.amplifyapp.com/)

---

## References

- [Using AWS CDK to Define DynamoDB Tables](https://dynobase.dev/dynamodb-aws-cdk/#:~:text=With%20AWS%20CDK%2C%20you%20can,2%20properties%3A%20partitionKey%20and%20billingMode%20.&text=DynamoDB%20provides%202%20billing%20modes,the%20billingMode%20property%20to%20dynamodb)
- [Learn Serverless on AWS Step-by-Step: Upload Files on S3](https://dev.to/slsbytheodo/learn-serverless-on-aws-step-by-step-upload-files-on-s3-50d4)
- [Learn Serverless on AWS Step-by-Step: Deploy a Frontend](https://dev.to/slsbytheodo/learn-serverless-on-aws-step-by-step-deploy-a-frontend-31a6)
- [AWS CLI Command to Describe EC2 Instances](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-instances.html)
