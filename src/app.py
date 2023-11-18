from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin # Import the CORS extension
import sqlite3

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in the app

# Initialize SQLite database
conn = sqlite3.connect('game_records.db')
c = conn.cursor()
c.execute('''
          CREATE TABLE IF NOT EXISTS game_records (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              player_name TEXT,
              score INTEGER
          )
          ''')
conn.commit()
conn.close()

@app.route('/save_score', methods=['POST'])
@cross_origin()  # Decorate the route to allow CORS
def save_score():
    try:
        data = request.json
        player_name = data.get('player_name') 
        score = data['score']

        # Save the score and player name to the SQLite database
        conn = sqlite3.connect('game_records.db')
        c = conn.cursor()
        c.execute('INSERT INTO game_records (player_name, score) VALUES (?, ?)', (player_name, score))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Score saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_scores', methods=['GET'])
def get_scores():
    try:
        # Retrieve all scores from the SQLite database
        conn = sqlite3.connect('game_records.db')
        c = conn.cursor()
        c.execute('SELECT player_name, score FROM game_records ORDER BY score DESC')
        scores = [{'player_name': row[0], 'score': row[1]} for row in c.fetchall()]
        conn.close()

        return jsonify({'scores': scores}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
