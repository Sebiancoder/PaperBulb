from secretK.secretK import OPENAI
import os
import openai
import requests

class OaiCaller():

    def __init__(self):

        openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
        openai.api_key = f"{OPENAI}"

    def callModel(prompt : str):

        response = openai.Completion.create(
            engine="davinci",  # Choose the appropriate engine
            prompt=prompt,
            max_tokens=50  # Maximum number of tokens in the response
        )