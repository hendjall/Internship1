from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'data.json'

def load_data():
    """Load data from the data.json file."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    return []

def save_data(data):
    """Save data to the data.json file."""
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=2)

@app.route('/data', methods=['POST'])
def receive_data():
    """Receive form data and save it to data.json."""
    form_data = request.json
    print('Received form data:', form_data)
    data = load_data()
    data.append(form_data)
    save_data(data)
    return jsonify({'message': 'Form data received successfully'}), 200

@app.route('/data', methods=['GET'])
def get_data():
    """Retrieve all data from data.json."""
    data = load_data()
    return jsonify(data), 200

@app.route('/data/<int:index>', methods=['PUT'])
def update_data(index):
    """Update form data at a specific index in data.json."""
    form_data = request.json
    data = load_data()
    if 0 <= index < len(data):
        data[index] = form_data
        save_data(data)
        return jsonify({'message': 'Form data updated successfully'}), 200
    return jsonify({'message': 'Index out of range'}), 400

@app.route('/data/<int:index>', methods=['DELETE'])
def delete_data(index):
    """Delete form data at a specific index from data.json."""
    data = load_data()
    if 0 <= index < len(data):
        data.pop(index)
        save_data(data)
        return jsonify({'message': 'Form data deleted successfully'}), 200
    return jsonify({'message': 'Index out of range'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8000)
