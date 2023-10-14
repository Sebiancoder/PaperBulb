from secrets.secrets import SEMSCHO
import os
import openai
import requests
import urllib.request
import PyPDF2
import datetime

def search10(query: str):
    '''Searches a term in semantic scholar and returns the 10 most relevant articles'''
    return requests.get(f"http://api.semanticscholar.org/graph/v1/paper/search?query={query.replace(' ', '+')}", headers={'X-API-KEY': SEMSCHO}).json()

def download_pdf(url: str):
    '''Downloads a PDF from a link and returns the relative file path'''
    try:
        rel_path = f"backend/temp/{datetime.datetime.now().timestamp()}"
        urllib.request.urlretrieve(pdf_link, rel_path, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'})
        return rel_path
    except:
        return None

def parse_pdf(url: str):
    rel_path = download_pdf(url)
    if rel_path is not None:
        pdf_file = open(rel_path, 'rb')
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for pg in pdf_reader.pages:
            text += pg.extract_text() + "\n\n"
        pdf_file.close()
        return text
    else:
        print("failure downloading pdf")
        return None

ggt = parse_pdf("https://arxiv.org/pdf/1703.06870.pdf")
breakpoint()