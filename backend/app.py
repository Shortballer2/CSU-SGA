from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "🎉 Backend is live!"

@app.route("/submit", methods=["POST"])
def submit():
    data = request.json
    print("Received submission:", data)
    return jsonify({"status": "success", "message": "Thanks for your idea!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
