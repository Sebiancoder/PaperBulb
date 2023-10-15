from secretK.secretK import OPENAI
import os
import openai
import requests

class OaiCaller():

    def __init__(self):

        #openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
        openai.api_key = f"{OPENAI}"

    def callModel(self, prompt : str):

        print("prompt")
        print(prompt)

        response = openai.Completion.create(
            engine="text-davinci-003",  # Choose the appropriate engine
            prompt=prompt,
            max_tokens=1750  # Maximum number of tokens in the response
        )

        print(response)

        return response

    def getGptSummary(self, abstract : str, ulev : str):

        levels = {
        'child': "middle school student",
        'highschool': "high school student",
        'undergrad': "undergraduate college student",
        'masters': "master's student",
        'original': "original"    
        }

        if ulev == "original":
            return abstract
        
        prompt = abstract + "Rewrite the previous so as to make it understandable by a " + levels[ulev] + "Respond with only a paragraph and no extra text or punctuation."

        return self.callModel(prompt)

    def getJargon(self, abstract : str):

        prompt = abstract + "Provide a comma separated list of words in the previous paragraph that would be considered jargon specific to the field. Do not write anything else but the comma-separated list. Do not put a period at the end"

        model_output = self.callModel(prompt)

        cleaned_mo = model_output.replace(".","").replace("\n","").split(",")

        for i in range(len(cleaned_mo)):

            cleaned_mo[i] = cleaned_mo[i].strip()

        return cleaned_mo