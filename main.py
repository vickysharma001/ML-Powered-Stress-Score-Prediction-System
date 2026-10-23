import os
import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Mental Health Prediction API",
    description="ML-powered Student Stress Score Prediction API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL PATH
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "Mental_Health_Models.pkl"
)

model = None


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():

    global model

    if not os.path.exists(MODEL_PATH):

        print("======================================")
        print("MODEL FILE NOT FOUND")
        print(f"Expected location: {MODEL_PATH}")
        print("======================================")

        return

    try:

        model = joblib.load(MODEL_PATH)

        print("======================================")
        print("MODEL LOADED SUCCESSFULLY")
        print(f"Model: {MODEL_PATH}")
        print("======================================")

    except Exception as e:

        print("======================================")
        print("MODEL LOADING ERROR")
        print(str(e))
        print("======================================")


load_model()


# ============================================================
# REQUEST MODEL
# ============================================================

class PredictionRequest(BaseModel):

    age: int = Field(
        ...,
        ge=10,
        le=100
    )

    gender: Literal[
        "Male",
        "Female"
    ]

    country: str = Field(
        ...,
        min_length=1
    )

    academic_level: Literal[
        "High School",
        "Undergraduate",
        "Postgraduate"
    ]

    most_used_platform: Literal[
        "Instagram",
        "Twitter",
        "Facebook",
        "TikTok",
        "YouTube",
        "Snapchat",
        "Reddit"
    ]

    purpose_of_use: Literal[
        "Entertainment",
        "Education",
        "Social",
        "Information",
        "Professional"
    ]

    avg_daily_usage_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    daily_unlocks: int = Field(
        ...,
        ge=0
    )

    study_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    physical_activity_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    sleep_hours_per_night: float = Field(
        ...,
        ge=0,
        le=24
    )

    stress_level: Literal[
        "Low",
        "Medium",
        "High",
        "Very High"
    ]


# ============================================================
# RESPONSE MODEL
# ============================================================

class PredictionResponse(BaseModel):

    predicted_mental_health_score: float

    stress_category: str

    recommendation: str


# ============================================================
# STRESS CATEGORY
# ============================================================

def categorize_stress(score: float) -> str:

    if score < 3.5:

        return "Low"

    elif score < 5.5:

        return "Medium"

    elif score < 7.5:

        return "High"

    else:

        return "Very High"


# ============================================================
# RECOMMENDATION
# ============================================================

def generate_recommendation(category: str) -> str:

    recommendations = {

        "Low":
            (
                "Your predicted stress level is low. "
                "Continue maintaining healthy sleep, regular physical activity, "
                "balanced study time and controlled screen usage."
            ),

        "Medium":
            (
                "Your predicted stress level is moderate. "
                "Try taking regular breaks, maintaining good sleep, "
                "reducing unnecessary screen time and balancing study with relaxation."
            ),

        "High":
            (
                "Your predicted stress level is high. "
                "Focus on improving sleep, reducing excessive screen usage, "
                "doing regular physical activity and talking to someone you trust "
                "if stress continues."
            ),

        "Very High":
            (
                "Your predicted stress level is very high. "
                "Consider talking to a trusted person, mentor or qualified "
                "mental health professional. Prioritize sleep, physical activity "
                "and reducing excessive screen usage."
            )
    }

    return recommendations[category]


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Mental Health Prediction API is running!",
        "status": "success",
        "model_loaded": model is not None,
        "docs": "/docs",
        "prediction_endpoint": "/predict"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None
    }


# ============================================================
# PREDICTION
# ============================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: PredictionRequest):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:

        raise HTTPException(
            status_code=503,
            detail="ML model is not loaded. Check Mental_Health_Models.pkl."
        )


    try:

        # ----------------------------------------------------
        # Country grouping
        # ----------------------------------------------------

        top_countries = {
            "India",
            "USA",
            "Canada",
            "Australia",
            "UK",
            "Germany",
            "Mexico",
            "Turkey",
            "France"
        }

        grouped_country = (
            data.country
            if data.country in top_countries
            else "Other"
        )


        # ----------------------------------------------------
        # Input DataFrame
        # ----------------------------------------------------

        input_data = pd.DataFrame([{

            "Age":
                data.age,

            "Gender":
                data.gender,

            "Country":
                data.country,

            "Academic_Level":
                data.academic_level,

            "Most_Used_Platform":
                data.most_used_platform,

            "Purpose_Of_Use":
                data.purpose_of_use,

            "Avg_Daily_Usage_Hours":
                data.avg_daily_usage_hours,

            "Daily_Unlocks":
                data.daily_unlocks,

            "Study_Hours":
                data.study_hours,

            "Physical_Activity_Hours":
                data.physical_activity_hours,

            "Sleep_Hours_Per_Night":
                data.sleep_hours_per_night,

            "Stress_Level":
                data.stress_level,

            "Grouped_country":
                grouped_country
        }])


        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        prediction = model.predict(input_data)[0]

        score = round(
            float(prediction),
            2
        )


        # ----------------------------------------------------
        # Keep score within expected range
        # ----------------------------------------------------

        score = max(
            0.0,
            min(10.0, score)
        )


        # ----------------------------------------------------
        # Category
        # ----------------------------------------------------

        category = categorize_stress(score)


        # ----------------------------------------------------
        # Recommendation
        # ----------------------------------------------------

        recommendation = generate_recommendation(
            category
        )


        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return PredictionResponse(

            predicted_mental_health_score=score,

            stress_category=category,

            recommendation=recommendation
        )


    except Exception as e:

        print("Prediction Error:")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )


# OLLAMA AI WELLNESS CHATBOT


import ollama


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000
    )


@app.post("/api/chat")
def wellness_chat(data: ChatRequest):

    try:
        response = ollama.chat(
            model="qwen2.5-coder:3b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a friendly AI wellness chatbot "
                        "for students in a stress prediction web "
                        "application. Help with exam stress, study "
                        "planning, relaxation, sleep habits, and "
                        "healthy routines. Reply in simple English. "
                        "Be empathetic, practical, and concise. "
                        "Do not diagnose medical conditions or "
                        "prescribe medication. Do not claim that "
                        "chat messages can accurately measure stress. "
                        "Encourage students to seek help from a "
                        "trusted person or qualified professional "
                        "when appropriate."
                    )
                },
                {
                    "role": "user",
                    "content": data.message
                }
            ],
            options={
                "temperature": 0.5
            }
        )

        return {
            "reply": response["message"]["content"],
            "model": "qwen2.5-coder:3b"
        }

    except Exception as e:
        print("Chatbot Error:", str(e))

        raise HTTPException(
            status_code=503,
            detail=(
                "The AI chatbot is currently unavailable. "
                "Please check that Ollama is running and "
                "qwen2.5-coder:3b is installed."
            )
        )

