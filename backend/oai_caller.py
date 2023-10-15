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

        return response['choices'][0]['text']

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
    
if __name__ == "__main__":
    abstract = "We present a conceptually simple, flexible, and general framework for object instance segmentation. Our approach efficiently detects objects in an image while simultaneously generating a high-quality segmentation mask for each instance. The method, called Mask R-CNN, extends Faster R-CNN by adding a branch for predicting an object mask in parallel with the existing branch for bounding box recognition. Mask R-CNN is simple to train and adds only a small overhead to Faster R-CNN, running at 5 fps. Moreover, Mask R-CNN is easy to generalize to other tasks, e.g., allowing us to estimate human poses in the same framework. We show top results in all three tracks of the COCO suite of challenges, including instance segmentation, bounding-box object detection, and person keypoint detection. Without tricks, Mask R-CNN outperforms all existing, single-model entries on every task, including the COCO 2016 challenge winners. We hope our simple and effective approach will serve as a solid baseline and help ease future research in instance-level recognition. Code will be made available.\n\n"
    oai = OaiCaller()
    ggt = oai.getJargon(abstract)
    breakpoint()
