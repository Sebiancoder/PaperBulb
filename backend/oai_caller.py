from secretK.secretK import OPENAI
import os
import openai
import requests

class OaiCaller():

    def __init__(self):

        openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
        openai.api_key = f"{OPENAI}"
        x = openai.Model.list()

    def callModel():


