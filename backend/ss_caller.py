from secrets.secrets import SEMSCHO
import os
import openai
import requests
import urllib.request
import PyPDF2
import datetime
import json

def search10(query: str):
    '''Searches a term in semantic scholar and returns the 10 most relevant articles'''
    try:
        return requests.get(f"http://api.semanticscholar.org/graph/v1/paper/search?query={query.replace(' ', '+')}", headers={'X-API-KEY': SEMSCHO}).json()
    except:
        print("Failure searching 10 most relevant articles")
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

def get_references(paper_id: str):
    '''Gets the references of a paper from semantic scholar'''
    try:
        response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,references', headers={'X-API-KEY': SEMSCHO}).json()
        return response['references']
    except:
        print("Failure retrieving references")
        return None

breakpoint()