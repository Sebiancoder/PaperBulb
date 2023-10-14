import boto3
from boto3.dynamodb.conditions import Key
from secretK.secretK import AWS_ACCESS_KEY, AWS_SECRET_KEY

class DbDriver():

    def __init__(self):

        self.session = boto3.Session(
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
        )

        self.db_client = self.session.resource('dynamodb', region_name='us-east-1')

    def fetch_record(self, table : str, primary_key : str, primary_key_value : str):
    
        table = self.db_client.Table(table)
        response = table.query(
            KeyConditionExpression=Key(primary_key).eq(primary_key_value)
        )

        return response['Items'][0]['json_obect']

    def set_record(self, table : str, primary_key : str, primary_key_value : str, json_object : str):

        table = self.db_client.Table(table)
        response = table.put_item(
            Item={
                primary_key: primary_key_value,
                'json_object': json_object
                }
        )