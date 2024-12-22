from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

translations = {
    "en": {"title": "ALERTZ", "description": "Stay safe with real-time missile alerts and guidance."},
    "he": {"title": "אזעקות", "description": "הישארו בטוחים עם התראות טילים בזמן אמת."},
    "ru": {"title": "АЛЕРТЗ", "description": "Будьте в безопасности с предупреждениями о ракетах в реальном времени."}
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/translate", methods=["POST"])
def translate():
    lang = request.json.get("lang", "en")
    return jsonify(translations.get(lang, translations["en"]))

@app.route("/simulate_attack", methods=["POST"])
def simulate_attack():
    shelter = {"lat": 32.0853, "lng": 34.7818}
    return jsonify({
        "message": "Missile alert activated! Please find the nearest shelter.",
        "shelter": shelter
    })

if __name__ == "__main__":
    app.run(debug=True)