"""Script to seed database"""

import os
import json

import crud
import model
import api

os.system("dropdb bookworm")
os.system("createdb bookworm")

model.connect_to_db(api.app)