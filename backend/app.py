import os
import smtplib
from email.message import EmailMessage
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to send requests

# Load credentials from environment variables
EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

@app.route("/", methods=["GET"])
def home():
    return "🎉 Backend is live!"

@app.route("/submit", methods=["POST"])
def submit():
    data = request.json
    print("📥 Submission received:", data)

    if EMAIL_ADDRESS and EMAIL_PASSWORD:
        try:
            send_email("New Idea Submission", data)
        except Exception as e:
            print("❌ Email error:", e)
            return jsonify({"status": "error", "message": "Email failed"}), 500

    return jsonify({"status": "success", "message": "Thanks for your idea!"})

@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    print("📨 Contact submission:", data)

    if EMAIL_ADDRESS and EMAIL_PASSWORD:
        try:
            send_email("New Contact Message", data)
        except Exception as e:
            print("❌ Email error:", e)
            return jsonify({"status": "error", "message": "Email failed"}), 500

    return jsonify({"status": "success", "message": "Message received!"})

def send_email(subject, data):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = EMAIL_ADDRESS

    body = "\n".join(f"{key.capitalize()}: {value}" for key, value in data.items())
    msg.set_content(f"{subject}:\n\n{body}")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
