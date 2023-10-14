from secrets.secrets import OPENAI, SEMSCHO
import os
import openai
import requests

OAI = False

if OAI:
    openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
    openai.api_key = f"{OPENAI}"
    x = openai.Model.list()
    breakpoint()

SS = False

def search10(query: str):
    return requests.get(f"http://api.semanticscholar.org/graph/v1/paper/search?query={query.replace(' ', '+')}", headers={'X-API-KEY': SEMSCHO}).json()


pdf_link = "https://www.researchgate.net/profile/Lu-Lu-51/publication/350158010_Learning_nonlinear_operators_via_DeepONet_based_on_the_universal_approximation_theorem_of_operators/links/607e32a6907dcf667baf49fd/Learning-nonlinear-operators-via-DeepONet-based-on-the-universal-approximation-theorem-of-operators.pdf?_sg%5B0%5D=started_experiment_milestone&_sg%5B1%5D=started_experiment_milestone&origin=journalDetail&_rtd=e30%3D"


breakpoint()