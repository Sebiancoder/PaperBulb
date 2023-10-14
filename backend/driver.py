import json
from flask import Flask, request, Response
from werkzeug.wrappers import Request
from database_driver import DbDriver

app = Flask("paperbulb")

#database object
db_driver = DbDriver()

class Driver:

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        request = Request(environ)
        
        return self.app(environ, start_response)

# Define routes
@app.route('/fetch_paper_info')
def fetch_paper():

    paper = request.args.get("paper")
    
    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper)
    
    print("record")
    print(record.keys())

    return record

@app.route('/generate_graph')
def generate_graph():
    '''
    references_dlimit - how many levels to search back for references
    cb_limit - how many levels to search cited by
    start_paper - paper_id of starting paper (query database to get metadata for this paper)
    '''
    references_dlimit = request.args.get("ref_dlim")
    cb_dlimit = request.args.get("cb_dlim")
    start_paper = request.args.get("start_paper")

    pass

@app.route('/get_gpt_summary')
def get_gpt_summary():

    paper = request.args.get("paper")

    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper)

    abstract = json.loads(records)["abstract"]

    return abstract

if __name__ == '__main__':
    app.wsgi_app = Driver(app.wsgi_app)
    app.run(debug=True)