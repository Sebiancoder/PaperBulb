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
import requests
import urllib.request
import datetime
import json
from database_driver import DbDriver


class SS:
    def __init__(self):
        self.dbd = DbDriver()

    def search10(self, query: str):
        '''Searches a term in semantic scholar and returns the 10 most relevant articles'''
        try:
            return [paper['paperId'] for paper in requests.get(f"http://api.semanticscholar.org/graph/v1/paper/search?query={query.replace(' ', '+')}", headers={'X-API-KEY': SEMSCHO}).json()['data']]
        except:
            print(f"Failure searching 10 most relevant articles. Query: {query}")
            return None

    def get_abstract(self, paper_id: str):
        '''Gets the abstract of a paper from semantic scholar'''
        try:
            response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,abstract', headers={'X-API-KEY': SEMSCHO}).json()
            return response['abstract']
        except:
            print("Failure retrieving abstract")
            return None

    def get_citations(self, paper_id: str):
        '''Gets the citations of a paper from semantic scholar'''
        try:
            response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,citations', headers={'X-API-KEY': SEMSCHO}).json()
            return response['citations']
        except:
            print("Failure retrieving citations")
            return None

    def get_reference_paper_ids(self, paper_id: str):
        '''Gets the reference ids of a paper from semantic scholar'''
        try:
            response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,references', headers={'X-API-KEY': SEMSCHO}).json()
            return [ref['paperId'] for ref in response['references']]
        except:
            print("Failure retrieving reference ids")
            return None

    def metadata_cutter(self, paper_id: str, response: dict):
        link = f"https://www.semanticscholar.org/paper/{paper_id}"
        title = response['title']
        authors = response['authors'] if response['authors'] else [{'authorId': int(0), 'name':'N/A'}]
        year = response['year']
        abstract = response['abstract']
        journal = response['journal']
        citations = [cit['paperId'] for cit in response['citations'] if cit['paperId'] is not None]
        references = [ref['paperId'] for ref in response['references'] if ref['paperId'] is not None]
        return {"url":link, "title":title, "authors":authors, "year":year, "abstract":abstract, "citations":citations, "journal":journal, "references":references}

    def get_reference_metadata_ss(self, reference_paper_ids: list):
        '''Returns the references of a paper from semantic scholar'''
        try:
            response = requests.post(
                'https://api.semanticscholar.org/graph/v1/paper/batch',
                params={'fields': 'title,authors,abstract,citations,references,year,journal'},
                json={"ids": reference_paper_ids}
            ).json()
            response = list(filter(lambda resp: resp is not None, response))
            refs = {resp['paperId']:self.metadata_cutter(resp['paperId'], resp) for resp in response}
            return refs
        except:
            print("Failure retrieving references")
            return None

    def get_list_of_metadata(self, paper_ids: list):
        '''Returns the references of a paper from either the database or semantic scholar. Leave original_paper_id as None'''
        rec = self.dbd.batch_fetch_record("paperTable", "paper_id", paper_ids)
        if rec is None:
            print("Error retreiving reference metadata from database")
            return None
        print(f"Relying on database for {len(rec)} of {len(paper_ids)}, semantic scholar for the rest")

        # Pull remaining items from semantic scholar
        ids_pulled = [*rec.keys()]
        papers_to_pull = [p_id for p_id in paper_ids if p_id not in ids_pulled]
        # Pull reference metadata from semantic scholar that isn't already in the database
        new_recs = {}
        i = 0
        for p_id in papers_to_pull:
            new_rec = self.get_metadata_ss(p_id)
            new_recs[p_id] = new_rec
            rec[p_id] = new_rec
            print("Paper done" + str(i))
            i += 1
        # batch push
        nrk = [*new_recs.keys()]
        nrv = [*new_recs.values()]
        while len(nrk) > 0:
            self.dbd.batch_update_record('paperTable', 'paper_id', nrk[:25], nrv[:25])
            if len(nrk) >= 25:
                nrk = nrk[25:]
                nrv = nrv[25:]

        return rec

    def get_metadata_ss(self, paper_id: str):
        '''Returns all metadata for the given paper id from semantic scholar'''
        try:
            response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=title,authors,abstract,citations,references,year,journal', headers={'X-API-KEY': SEMSCHO}).json()
            return self.metadata_cutter(paper_id, response)
        except:
            print("Failure retrieving metadata")
            return None

    def get_metadata(self, paper_id: str):
        '''Returns the metadata for a paper by sourcing it from either the database or from semantic scholar'''
        rec = self.dbd.fetch_record("paperTable", "paper_id", paper_id)
        if rec is None:
            rec = self.get_metadata_ss(paper_id)
            if rec is not None:
                self.dbd.update_record("paperTable", "paper_id", paper_id, rec)
        else:
            rec = rec["paper_metadata"]
        return rec
    

if __name__ == "__main__":
    # ss = SS()
    # ggp = ss.get_metadata("1a0912bb76777469295bb2c059faee907e7f3258")
    # print(ggp['references'])
    # ggt = ss.get_list_of_metadata(ggp['references'])
    breakpoint()
