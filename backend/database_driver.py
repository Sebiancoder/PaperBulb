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

        if len(response['Items']) == 0:
            return None

        match_item = response['Items'][0]

        return match_item

    def batch_fetch_record(self, table: str, primary_key: str, primary_key_values: list):
        query_dict = {
            table: {
                'Keys': [{primary_key: val} for val in primary_key_values]
            }
        }
        response = self.db_client.batch_get_item(
            RequestItems=query_dict
        )

        match_item = {match_item['paper_id']:match_item['paper_metadata'] for match_item in response['Responses'][table]}

        return match_item

    def update_record(self, table : str, primary_key : str, primary_key_value : str, json_object : str, gpt_summaries : str = None):

        table_name = table
        table = self.db_client.Table(table)

        pk_pair = {primary_key: primary_key_value}

        if gpt_summaries is None:

            update_expression = 'SET paper_metadata = :pm'
            update_values = {
                ':pm': json_object
            }

        else:

            update_expression = 'SET paper_metadata = :pm, gpt_summaries = :gpts'
            update_values = {
                ':pm': json_object,
                ':gpts': gpt_summaries
            }

        response = table.update_item(
                TableName=table_name,
                Key=pk_pair,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=update_values
            )

    def batch_update_record(self, table : str, primary_key : str, primary_key_values : list, json_objects : list, gpt_summaries : list = None):
        if gpt_summaries is None:
            query_dict = {
                table: [{
                    'PutRequest': {
                        'Item': {
                            'paper_id': primary_key_values[idx],
                            'paper_metadata':json_objects[idx]
                        }
                    }
                } for idx in range(len(primary_key_values))]
            }
            response = self.db_client.batch_write_item(
                RequestItems=query_dict
            )
        else:
            query_dict = {
                table: [{
                    'PutRequest': {
                        'Item': {
                            'paper_id': primary_key_values[idx],
                            'paper_metadata':json_objects[idx],
                            'gpt_summaries':gpt_summaries[idx]
                        }
                    }
                } for idx in range(len(primary_key_values))]
            }
            response = self.db_client.batch_write_item(
                RequestItems=query_dict
            )

    def update_gpt(self, table : str, primary_key : str, primary_key_value, gpt : dict):

        tableObj = self.db_client.Table(table)

        pk_pair = {primary_key: primary_key_value}
        
        update_expression = 'SET gpt_summaries = :gpts'
        update_values = {
            ':gpts': gpt
        }

        response = table.update_item(
                TableName=table,
                Key=pk_pair,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=update_values)

    