import json
from flask import Flask, jsonify
from flask import render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/map')
def map():
    return render_template('map.html')
