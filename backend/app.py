import smtplib
from email.message import EmailMessage
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (from dawsonandmathis.com)

# Load your email credentials from environment variables
EMAIL_ADDRESS = os.environ.get("mathisvpcampaign@gmail.com")
EMAIL_PASSWORD = os.environ.get("lsiv eklw erlu uioi")

@app.route("/")
def home():
    return "🎉 Backend is live!"

@app.route("/idea", methods=["POST"])
def submit():
    data = request.json
    print("Received submission:", data)

    if EMAIL_ADDRESS and EMAIL_PASSWORD:
        try:
            send_email(data)
        except Exception as e:
            print("❌ Email send error:", str(e))
            return jsonify({"status": "error", "message": "Email failed"}), 500

    return jsonify({"status": "success", "message": "Thanks for your idea!"})

@app.route("/contact", methods=["POST"])
def contact():
    data = request.json
    print("Contact submission:", data)
    # Optionally email it, log it, etc.
    return jsonify({"status": "success", "message": "Message received!"})


def send_email(data):
    msg = EmailMessage()
    msg["Subject"] = "New Idea Submission"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = EMAIL_ADDRESS

    msg.set_content(f"""
New Submission from the campaign site:

Submission Type: {data.get("followup")}
Name: {data.get("name")}
Email: {data.get("email")}
Type: {data.get("submission_type")}
Category: {data.get("category")}
Description: {data.get("description")}
    """)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)