import json
from flask import Flask, request, Response
from werkzeug.wrappers import Request
from database_driver import DbDriver
from ss_caller import get_metadata, search10
from oai_caller import OaiCaller
from flask_cors import CORS

app = Flask("paperbulb")
CORS(app)

#database object
db_driver = DbDriver()
oai_caller = OaiCaller()

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
        primary_key_value=paper)["paper_metadata"]
    
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

    try:
        references_dlimit = int(references_dlimit)
    except:
        print("invalid input to generate graph")
        return "FAIL"

    # Collect all paper metadata, indexed by paper_id
    papers = {}
    curr_paper_ids = {start_paper}
    next_paper_ids = set()
    for _ in range(references_dlimit):
        for curr_paper_id in curr_paper_ids:
            if curr_paper_id not in papers:
                metadata = get_metadata(curr_paper_id)
                papers[curr_paper_id] = metadata
                for ref in metadata['references']:
                    next_paper_ids.add(ref)
            else:
                continue
        curr_paper_ids = next_paper_ids
        next_paper_ids = set()
        print(f"Size of next: {len(curr_paper_ids)}")

    for curr_paper_id in curr_paper_ids:
        if curr_paper_id not in papers:
            metadata = get_metadata(curr_paper_id)
            papers[curr_paper_id] = metadata
        else:
            continue

    return papers

@app.route('/get_gpt_summary')
def get_gpt_summary():

    paper = request.args.get("paper")
    ulev = request.args.get("ulev")

    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper,
        column="gpt_summaries")

    print(record)

    abstract = record["paper_metadata"]["abstract"]

    generated_summary = oai_caller.getGptSummary(abstract, ulev)

    return generated_summary

@app.route('/search_papers')
def search_papers():
    '''Returns the 10 most relevant articles for a given query'''
    query = request.args.get("query")

    query_result = search10(query)

    if query_result is None:
        print("Query search fail")
        return "FAIL"

    papers = {paper_id:get_metadata(paper_id) for paper_id in query_result}
    return papers if papers is not None else "FAIL"

if __name__ == '__main__':
    app.wsgi_app = Driver(app.wsgi_app)
    app.run(debug=True)