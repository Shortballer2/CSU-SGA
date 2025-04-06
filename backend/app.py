import smtplib
from email.message import EmailMessage
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

EMAIL_ADDRESS = "contact@dawsonandmathis.com"   # Your Gmail address
EMAIL_PASSWORD = "edvo oaun kzsn bnsg"       # App password from above

def send_email(data):
    msg = EmailMessage()
    msg["Subject"] = "New Idea Submission"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = EMAIL_ADDRESS  # You can send to the same account

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
