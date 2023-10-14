from secretK.secretK import OPENAI
import os
import openai
import requests

class OaiCaller():

    def __init__(self):

        #openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
        openai.api_key = f"{OPENAI}"

    def callModel(self, prompt : str):

        response = openai.Completion.create(
            engine="davinci",  # Choose the appropriate engine
            prompt=prompt,
            max_tokens=1750  # Maximum number of tokens in the response
        )

        print(response)

        return response["choices"][0].text

    def getGptSummary(self, abstract : str, ulev : str):

        levels = {
        'ms': "middle school student",
        'hs': "high school student",
        'bs': "undergraduate college student",
        'ms': "master's student",
        'phd': "phd"
        }

        prompt = abstract + "Rewrite the previous so as to make it understandable by a " + levels[ulev]

        return self.callModel(prompt)
