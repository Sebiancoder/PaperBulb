import json
from flask import Flask, request, Response
from werkzeug.wrappers import Request
from database_driver import DbDriver
from ss_caller import SS
from oai_caller import OaiCaller
from flask_cors import CORS

app = Flask("paperbulb")
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#database object
db_driver = DbDriver()
oai_caller = OaiCaller()
ss = SS()

class Driver:

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        request = Request(environ)
        
        return self.app(environ, start_response)

@app.route("/")
def healthCheck():
    return "Success"

# Define routes
@app.route('/fetch_paper_info')
def fetch_paper():

    paper = request.args.get("paper")
    
    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper)["paper_metadata"]
    
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
    min_year = request.args.get("min_year")
    min_num_citations = request.args.get("min_num_citations")
    n_least_references = request.args.get("n_least_references")

    try:
        references_dlimit = int(references_dlimit)
        min_year = int(min_year)
        n_least_references = int(n_least_references)
        min_num_citations = int(min_num_citations)
    except:
        print("invalid input to generate graph")
        return "FAIL"

    # Collect all paper metadata, indexed by paper_id
    papers = {start_paper: ss.get_metadata(start_paper)}
    curr_paper_ids = {start_paper}
    next_paper_ids = set()
    for _ in range(references_dlimit):
        for curr_paper_id in curr_paper_ids:
            # Find next papers that haven't already been discovered
            next_refs = [val for val in papers[curr_paper_id]['references'] if val not in papers]
            new_papers = ss.get_list_of_metadata(next_refs)

            # Filter
            def dec_to_int(dec):
                if dec is None:
                    return 0
                return int(dec)
            
            new_papers = {key:new_papers[key] for key in new_papers.keys() if dec_to_int(new_papers[key]['year']) >= min_year} # Filter old
            new_papers = {key:new_papers[key] for key in new_papers.keys() if len(new_papers[key]['citations']) >= min_num_citations} # Filter low citation count articles
            ref_count = dict(sorted({key:len(new_papers[key]['references']) for key in new_papers.keys()}.items(), key=lambda item: item[1])[:min(n_least_references, len(new_papers))])
            new_papers = {key:new_papers[key] for key in new_papers.keys() if key in ref_count} # Select n papers with least references

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
        primary_key_value=paper
    )

    if record is None:
        print("RECORD FAIL")
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

        return gptsum_json

    if "gpt_summaries" not in record:
        record["gpt_summaries"] = {"child" : None, "highschool" : None, "undergrad" : None, "masters" : None, "original" : None, "jargon" : None, "learn_more": None}

    gptsums = record["gpt_summaries"]

    if ulev in gptsums and gptsums[ulev] is not None:
        return gptsums

    generated_summary = oai_caller.getGptSummary(abstract, ulev)

    gptsums[ulev] = generated_summary

    db_driver.update_record(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            json_object=record["paper_metadata"],
            gpt_summaries=gptsums
        )

    return gptsums

@app.route('/get_jargon')
def get_jargon():

    paper = request.args.get("paper")

    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper
    )

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

        return gptsum_json

    if "gpt_summaries" not in record:
        record["gpt_summaries"] = {"child" : None, "highschool" : None, "undergrad" : None, "masters" : None, "original" : None, "jargon" : None, "learn_more": None}

    gptsums = record["gpt_summaries"]

    if "jargon" in gptsums:
        return gptsums

    jargon = oai_caller.getJargon(abstract)

    gptsums["jargon"] = jargon

    db_driver.update_gpt(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            gpt=gptsums
        )

    return gptsums

@app.route('/learn_more')
def learn_more():
    '''Finds out more information given an abstract'''
    paper = request.args.get("paper")
    
    record = db_driver.fetch_record(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper
    )

    if record is None:
        return "FAIL"
    
    abstract = record["paper_metadata"]["abstract"]
    
    if "gpt_summaries" not in record or record["gpt_summaries"] is None:

        more = oai_caller.learn_more(abstract)

        gptsum_json = {
            "learn_more": more
        }

        db_driver.update_gpt(
            table="paperTable",
            primary_key="paper_id",
            primary_key_value=paper,
            gpt=gptsum_json
        )

        return gptsum_json
    
    if "gpt_summaries" not in record:
        record["gpt_summaries"] = {"child" : None, "highschool" : None, "undergrad" : None, "masters" : None, "original" : None, "jargon" : None, "learn_more": None}

    gptsums = record["gpt_summaries"]

    if "learn_more" in gptsums:
        return gptsums

    more = oai_caller.learn_more(abstract)

    gptsums["learn_more"] = more

    db_driver.update_gpt(
        table="paperTable",
        primary_key="paper_id",
        primary_key_value=paper,
        gpt=gptsums
    )

    return gptsums

@app.route('/search_papers')
def search_papers():
    '''Returns the 10 most relevant articles for a given query'''
    query = request.args.get("query")

    query_result = ss.search10(query)

    if query_result is None or len(query_result) == 0:
        print("Query search fail")
        return "FAIL"

    papers = {paper_id:ss.get_metadata(paper_id) for paper_id in query_result}
    return papers if papers is not None else "FAIL"

if __name__ == '__main__':
    #app.wsgi_app = Driver(app.wsgi_app)
    print("running")
    app.run(debug=True, host='0.0.0.0')