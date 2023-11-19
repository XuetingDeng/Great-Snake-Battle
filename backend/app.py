from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from google.cloud import datastore

app = Flask(__name__)
CORS(app)

# Initialize Datastore
db = datastore.Client()

@app.route('/save_score', methods=['POST'])
@cross_origin()
def save_score():
    try:
        data = request.json
        player_name = data.get('player_name') 
        score = data['score']

        # Save the score and player name to Cloud Datastore
        kind = 'GameRecord'
        entity_key = db.key(kind)
        entity = datastore.Entity(key=entity_key)
        entity.update({'player_name': player_name, 'score': score})
        db.put(entity)

        return jsonify({'message': 'Score saved successfully', 'entity_id': entity.key.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_scores', methods=['GET'])
def get_scores():
    try:
        # Retrieve all scores from Cloud Datastore
        kind = 'GameRecord'
        query = db.query(kind=kind)
        # scores = query.order('-score').fetch()
        scores = query.fetch()
        # scores = query.order(datastore.PropertyOrder('score', descending=True)).fetch()
        score_list = [{'player_name': s['player_name'], 'score': s['score']} for s in scores]

        # Sort the score_list based on the 'score' in descending order
        sorted_score_list = sorted(score_list, key=lambda x: int(x['score']), reverse=True)

        return jsonify({'scores': score_list}), 200
    except Exception as e:
        return jsonify({'error': str(e), 'kind': kind}), 500


if __name__ == '__main__':
    app.run(debug=True)
