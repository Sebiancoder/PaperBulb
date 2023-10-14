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
    
    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value='test')
    
    print("record")

    return record

@app.route('/generate_graph')
def generate_graph(references_dlimit, cb_dlimit):

    pass

@app.route('/get_gpt_summary')
def get_gpt_summary():

    pass

@app.route('/load_related_papers')

@app.route('') """

if __name__ == '__main__':
    app.wsgi_app = Driver(app.wsgi_app)
    app.run(debug=True)