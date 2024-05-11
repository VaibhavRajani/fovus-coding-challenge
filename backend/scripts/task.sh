#!/bin/bash

# Set the variables from script arguments
original_id=$1
tableName=$2
id=$3

# Fetch item from DynamoDB
response=$(aws dynamodb get-item --table-name ${tableName} --key '{ "id": { "S": "'"${original_id}"'" } }')
if [ $? -ne 0 ]; then
    echo "Error: Dynamo GET Failed."
    exit 1
fi

# Extract 'textInput' and 'InputFilePath' from the response
textInput=$(echo $response | jq -r '.Item.textInput.S' | tr -d '\n')
InputFilePath=$(echo $response | jq -r '.Item.InputFilePath.S')

# Check if variables are defined
if [ -z "$textInput" ] || [ -z "$InputFilePath" ]; then
    echo "Error: textInput or InputFilePath Undefined."
    exit 1
fi

# Parse the file path and form a new output file path
filePathArr=(${InputFilePath//// })
outputFilePath="${filePathArr[0]}/Output_${filePathArr[1]}"

# Copy file from S3, append text, and upload back to S3
aws s3 cp "s3://${InputFilePath}" input_file.txt
if [ $? -ne 0 ]; then
    echo "Error: S3 GET Failed."
    exit 1
fi

echo " : ${textInput}" >> input_file.txt

aws s3 cp input_file.txt "s3://${outputFilePath}"
if [ $? -ne 0 ]; then
    echo "Error: S3 PUT Failed."
    exit 1
fi

# Add a new item to DynamoDB
aws dynamodb put-item --table-name $tableName --item '{ "id": { "S": "'"$id"'" }, "outputFilePath": { "S": "'"${outputFilePath}"'" } }'
if [ $? -ne 0 ]; then
    echo "Error: DynamoDB PUT Failed."
    exit 1
fi

echo "Success: Script Executed."
