import json
from flask import Flask, request, Response
from werkzeug.wrappers import Request
from database_driver import DbDriver
from ss_caller import get_metadata, search10, get_list_of_metadata
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
    papers = {start_paper: get_metadata(start_paper)}
    curr_paper_ids = {start_paper}
    next_paper_ids = set()
    for _ in range(references_dlimit):
        for curr_paper_id in curr_paper_ids:
            new_papers = get_list_of_metadata(papers[curr_paper_id]['references'])
            papers = {**papers, **new_papers}
            for new_paper in new_papers.values():
                for ref in new_paper['references']:
                    if ref not in papers:
                        next_paper_ids.add(ref)
        curr_paper_ids = next_paper_ids
        next_paper_ids = set()
        print(f"Size of next: {len(curr_paper_ids)}")
    return papers

@app.route('/get_gpt_summary')
def get_gpt_summary():

    paper = request.args.get("paper")
    ulev = request.args.get("ulev")

    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper)

    print(record)

    if record is None:
        return "FAIL"

    abstract = record["paper_metadata"]["abstract"]

    if "gpt_summaries" not in record or record["gpt_summaries"] is None:

        generated_summary = oai_caller.getGptSummary(abstract, ulev)

        gptsum_json = {
            ulev: generated_summary
        }

        db_driver.update_record(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            json_object=record["paper_metadata"],
            gpt_summaries=gptsum_json
        )

        return generated_summary

    gptsums = record["gpt_summaries"]

    if ulev in gptsums:
        return gptsums[ulev]

    generated_summary = oai_caller.getGptSummary(abstract, ulev)

    gptsums[ulev] = generated_summary

    db_driver.update_record(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            json_object=record["paper_metadata"],
            gpt_summaries=gptsums
        )

    return generated_summary

@app.route('/get_jargon')
def get_jargon():

    paper = request.args.get("paper")

    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper)

    if record is None:
        return "FAIL"

    abstract = record["paper_metadata"]["abstract"]

    if "gpt_summaries" not in record or record["gpt_summaries"] is None:

        jargon = oai_caller.getJargon(abstract)

        gptsum_json = {
            "jargon": jargon
        }

        db_driver.update_gpt(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            gpt=gptsum_json
        )

        return jargon

    gptsums = record["gpt_summaries"]

    if "jargon" in gptsums:
        return gptsums["jargon"]

    jargon = oai_caller.getJargon(abstract)

    gptsums["jargon"] = jargon

    db_driver.update_gpt(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            gpt=gptsums
        )

    return jargon

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