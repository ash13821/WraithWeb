from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime
from email.message import EmailMessage
import smtplib
import html
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))



app = FastAPI()


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# EMAIL SETTINGS
# -----------------------------

YOUR_EMAIL = os.getenv("YOUR_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")


# -----------------------------
# DATA MODEL
# -----------------------------

class Grievance(BaseModel):
    name: str
    age: str
    location: str
    email: EmailStr
    grievance: str


# -----------------------------
# SUBMIT GRIEVANCE
# -----------------------------

@app.post("/submit-grievance")
async def submit_grievance(data: Grievance):
    print("EMAIL RECEIVED:", data.email)

    submission_time = datetime.now().strftime(
        "%d %B %Y · %I:%M %p"
    )

    # Escape user input before putting it into HTML
    name = html.escape(data.name)
    age = html.escape(data.age)
    location = html.escape(data.location)
    email = html.escape(str(data.email))
    grievance = html.escape(data.grievance)

    # Create email
    message = EmailMessage()

    message["Subject"] = f"✦ NEW CASE FILE · {data.name}"
    message["From"] = YOUR_EMAIL
    message["To"] = YOUR_EMAIL
    message["Reply-To"] = str(data.email)

    # -----------------------------
    # HTML EMAIL
    # -----------------------------

    html_content = f"""
    <!DOCTYPE html>

    <html>

    <body style="
        margin:0;
        padding:40px 20px;
        background:#090806;
        font-family:Arial, Helvetica, sans-serif;
        color:#e9e0cb;
    ">

        <div style="
            max-width:650px;
            margin:auto;
            background:#120e0a;
            border:1px solid #3d3321;
        ">

            <!-- HEADER -->

            <div style="
                padding:32px;
                border-bottom:1px solid #3d3321;
            ">

                <div style="
                    color:#c9a24b;
                    font-size:11px;
                    letter-spacing:4px;
                    margin-bottom:14px;
                ">
                    WRAITHWEB // SECURE INTAKE
                </div>

                <div style="
                    font-family:Georgia, serif;
                    font-size:32px;
                    color:#e9e0cb;
                ">
                    NEW CASE FILE
                </div>

                <div style="
                    margin-top:8px;
                    color:#8f836b;
                    font-size:12px;
                    letter-spacing:1px;
                ">
                    A new signal has been received.
                </div>

            </div>


            <!-- CASE NAME -->

            <div style="
                padding:20px 32px;
                border-bottom:1px solid #3d3321;
                color:#c9a24b;
                font-size:10px;
                letter-spacing:3px;
            ">
                CASE // {name.upper()}
            </div>


            <!-- SUBJECT INFORMATION -->

            <div style="
                padding:30px 32px;
            ">

                <div style="
                    color:#c9a24b;
                    font-size:10px;
                    letter-spacing:3px;
                    margin-bottom:20px;
                ">
                    SUBJECT INFORMATION
                </div>


                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="border-collapse:collapse;"
                >

                    <tr>

                        <td style="
                            padding:12px 0;
                            color:#8f836b;
                            font-size:11px;
                            width:35%;
                        ">
                            NAME
                        </td>

                        <td style="
                            padding:12px 0;
                            color:#e9e0cb;
                            font-size:14px;
                        ">
                            {name}
                        </td>

                    </tr>


                    <tr>

                        <td style="
                            padding:12px 0;
                            color:#8f836b;
                            font-size:11px;
                        ">
                            AGE
                        </td>

                        <td style="
                            padding:12px 0;
                            color:#e9e0cb;
                            font-size:14px;
                        ">
                            {age}
                        </td>

                    </tr>


                    <tr>

                        <td style="
                            padding:12px 0;
                            color:#8f836b;
                            font-size:11px;
                        ">
                            LOCATION
                        </td>

                        <td style="
                            padding:12px 0;
                            color:#e9e0cb;
                            font-size:14px;
                        ">
                            {location}
                        </td>

                    </tr>


                    <tr>

                        <td style="
                            padding:12px 0;
                            color:#8f836b;
                            font-size:11px;
                        ">
                            EMAIL
                        </td>

                        <td style="
                            padding:12px 0;
                            color:#e9e0cb;
                            font-size:14px;
                        ">
                            {email}
                        </td>

                    </tr>

                </table>

            </div>


            <!-- GRIEVANCE -->

            <div style="
                margin:0 32px 30px;
                padding:25px;
                background:#0b0907;
                border-left:3px solid #c9a24b;
            ">

                <div style="
                    color:#c9a24b;
                    font-size:10px;
                    letter-spacing:3px;
                    margin-bottom:15px;
                ">
                    GRIEVANCE
                </div>

                <div style="
                    color:#e9e0cb;
                    font-family:Georgia, serif;
                    font-size:18px;
                    line-height:1.6;
                ">
                    {grievance}
                </div>

            </div>


            <!-- SUBMISSION -->

            <div style="
                padding:25px 32px;
                border-top:1px solid #3d3321;
            ">

                <div style="
                    color:#8f836b;
                    font-size:10px;
                    letter-spacing:2px;
                ">
                    SUBMITTED
                </div>

                <div style="
                    margin-top:7px;
                    color:#e9e0cb;
                    font-size:13px;
                ">
                    {submission_time}
                </div>

                <div style="
                    margin-top:25px;
                    color:#c9a24b;
                    font-family:Georgia, serif;
                    font-style:italic;
                    font-size:13px;
                ">
                    The signal has been received.
                </div>

            </div>

        </div>

    </body>

    </html>
    """

    # Add HTML version of email
    message.add_alternative(
        html_content,
        subtype="html"
    )


    # -----------------------------
    # SEND EMAIL THROUGH GMAIL
    # -----------------------------

    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as smtp:

        smtp.login(
            YOUR_EMAIL,
           APP_PASSWORD
        )

        smtp.send_message(message)


    # -----------------------------
    # RESPONSE TO WEBSITE
    # -----------------------------

    return {
        "success": True,
        "message": "Grievance submitted successfully"
    }
