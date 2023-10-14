from secrets.secrets import OPENAI, SEMSCHO
import os
import openai

openai.organization = "org-zVepG3kIxRXl8x7hB7Ro2zKF"
openai.api_key = os.getenv(OPENAI)
openai.Model.list()