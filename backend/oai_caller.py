from secretK.secretK import OPENAI
import os
import openai
import requests

OAI = False

if OAI:
    openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
    openai.api_key = f"{OPENAI}"
    x = openai.Model.list()
    breakpoint()
