'''
Credit for API: Semantic Scholar

@article{Kinney2023TheSS,
  title={The Semantic Scholar Open Data Platform},
  author={Rodney Michael Kinney and Chloe Anastasiades and Russell Authur and Iz Beltagy and Jonathan Bragg and Alexandra Buraczynski and Isabel Cachola and Stefan Candra and Yoganand Chandrasekhar and Arman Cohan and Miles Crawford and Doug Downey and Jason Dunkelberger and Oren Etzioni and Rob Evans and Sergey Feldman and Joseph Gorney and David W. Graham and F.Q. Hu and Regan Huff and Daniel King and Sebastian Kohlmeier and Bailey Kuehl and Michael Langan and Daniel Lin and Haokun Liu and Kyle Lo and Jaron Lochner and Kelsey MacMillan and Tyler Murray and Christopher Newell and Smita R Rao and Shaurya Rohatgi and Paul L Sayre and Zejiang Shen and Amanpreet Singh and Luca Soldaini and Shivashankar Subramanian and A. Tanaka and Alex D Wade and Linda M. Wagner and Lucy Lu Wang and Christopher Wilhelm and Caroline Wu and Jiangjiang Yang and Angele Zamarron and Madeleine van Zuylen and Daniel S. Weld},
  journal={ArXiv},
  year={2023},
  volume={abs/2301.10140},
  url={https://api.semanticscholar.org/CorpusID:256194545}
}
'''

from secretK.secretK import SEMSCHO
import os
import openai
import requests
import urllib.request
import PyPDF2
import datetime
import json
from database_driver import DbDriver

dbd = DbDriver()

def search10(query: str):
    '''Searches a term in semantic scholar and returns the 10 most relevant articles'''
    try:
        return [paper['paperId'] for paper in requests.get(f"http://api.semanticscholar.org/graph/v1/paper/search?query={query.replace(' ', '+')}", headers={'X-API-KEY': SEMSCHO}).json()['data']]
    except:
        print(f"Failure searching 10 most relevant articles. Query: {query}")
        return None

def download_pdf(url: str):
    '''Downloads a PDF from a link and returns the relative file path'''
    try:
        rel_path = f"backend/temp/{datetime.datetime.now().timestamp()}"
        urllib.request.urlretrieve(pdf_link, rel_path, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'})
        return rel_path
    except:
        print("Failure downloading PDF")
        return None

def parse_pdf(url: str):
    '''BROKEN; DO NOT USE
        Downloads a PDF from a URL and reads its text to string
        '''
    rel_path = download_pdf(url)
    if rel_path != "Fail":
        pdf_file = open(rel_path, 'rb')
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for pg in pdf_reader.pages:
            text += pg.extract_text() + "\n\n"
        pdf_file.close()
        return text
    else:
        print("Failure downloading pdf")
        return None

def get_abstract(paper_id: str):
    '''Gets the abstract of a paper from semantic scholar'''
    try:
        response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,abstract', headers={'X-API-KEY': SEMSCHO}).json()
        return response['abstract']
    except:
        print("Failure retrieving abstract")
        return None

def get_citations(paper_id: str):
    '''Gets the citations of a paper from semantic scholar'''
    try:
        response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,citations', headers={'X-API-KEY': SEMSCHO}).json()
        return response['citations']
    except:
        print("Failure retrieving citations")
        return None

def get_reference_paper_ids(paper_id: str):
    '''Gets the reference ids of a paper from semantic scholar'''
    try:
        response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,references', headers={'X-API-KEY': SEMSCHO}).json()
        return [ref['paperId'] for ref in response['references']]
    except:
        print("Failure retrieving reference ids")
        return None

def metadata_cutter(paper_id: str, response: dict):
    link = f"https://www.semanticscholar.org/paper/{paper_id}"
    title = response['title']
    authors = response['authors']
    year = response['year']
    abstract = response['abstract']
    journal = response['journal']
    citations = [cit['paperId'] for cit in response['citations']]
    references = [ref['paperId'] for ref in response['references']]
    return {"url":link, "title":title, "authors":authors, "year":year, "abstract":abstract, "citations":citations, "journal":journal, "references":references}

def get_reference_metadata(reference_paper_ids: list):
    '''Returns the references of a paper from semanic scholar'''
    try:
        response = requests.post(
            'https://api.semanticscholar.org/graph/v1/paper/batch',
            params={'fields': 'title,authors,abstract,citations,references,year,journal'},
            json={"ids": reference_paper_ids}
        ).json()
        response = list(filter(lambda resp: resp is not None, response))
        refs = {resp['paperId']:metadata_cutter(resp['paperId'], resp) for resp in response}
        return refs
    except:
        print("Failure retrieving references")
        return None

def get_metadata_ss(paper_id: str):
    '''Returns all metadata for the given paper id'''
    try:
        response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,authors,abstract,citations,references,year,journal', headers={'X-API-KEY': SEMSCHO}).json()
        return metadata_cutter(paper_id, response)
    except:
        print("Failure retrieving metadata")
        return None

def get_metadata(paper_id: str):
    '''Returns the metadata for a paper by sourcing it from either the database or from semantic scholar'''
    rec = dbd.fetch_record("paperTable", "paper_id", paper_id)
    if rec is None:
        rec = get_metadata_ss(paper_id)
        if rec is not None:
            dbd.update_record("paperTable", "paper_id", paper_id, rec)
    else:
        rec = rec["paper_metadata"]
    return rec
    

if __name__ == "__main__":
    ggp = get_metadata("0bc975e61002ec29ac67d44d91d35cdbfc56982a")
    ggt = get_reference_metadata(ggp['references'])
    breakpoint()
