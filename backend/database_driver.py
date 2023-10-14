import boto3
from secrets.secrets import AWS_ACCESS_KEY, AWS_SECRET_KEY

class DbDriver():

    def __init__():

        self.session = boto3.Session(
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
        )

        self.db_client = self.session.resource('dynamodb', region_name='us-east-1')

    def fetch_record(primary_key : str):
    

    def set_record(primary_key : str, json_object : str):

        table = dynamodb.Table('paperTable')
        response = table.put_item(
        Item={
            'PrimaryKeyName': 'Value1',
            'SortKeyName': 42,
            'OtherAttribute': 'OtherValue'
        }
)