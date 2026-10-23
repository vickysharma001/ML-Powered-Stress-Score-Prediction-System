import React, { useState } from "react";
import "./App.css";

const API_URL =
  "https://ml-powered-stress-score-prediction.onrender.com/predict";

function App() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    country: "",
    academicLevel: "",
    mostUsedPlatform: "",
    purposeOfUse: "",
    averageUsage: "",
    dailyUnlocks: "",
    studyHours: "",
    physicalActivity: "",
    sleepHours: "",
    stressLevel: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setFormData({
      age: "",
      gender: "",
      country: "",
      academicLevel: "",
      mostUsedPlatform: "",
      purposeOfUse: "",
      averageUsage: "",
      dailyUnlocks: "",
      studyHours: "",
      physicalActivity: "",
      sleepHours: "",
      stressLevel: "",
    });

    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      age: Number(formData.age),
      gender: formData.gender,
      country: formData.country.trim(),
      academic_level: formData.academicLevel,
      most_used_platform: formData.mostUsedPlatform,
      purpose_of_use: formData.purposeOfUse,
      avg_daily_usage_hours: Number(formData.averageUsage),
      daily_unlocks: Number(formData.dailyUnlocks),
      study_hours: Number(formData.studyHours),
      physical_activity_hours: Number(formData.physicalActivity),
      sleep_hours_per_night: Number(formData.sleepHours),
      stress_level: formData.stressLevel,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from backend.");
      }

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const messages = data.detail
            .map((item) => item.msg)
            .join(", ");

          throw new Error(messages);
        }

        throw new Error(data.detail || "Prediction failed.");
      }

      setResult(data);
    } catch (err) {
      if (err.name === "TypeError") {
        setError(
          "Backend connection failed. Please make sure FastAPI is running on port 8001."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (category) => {
    if (!category) return "";

    return category
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="app-container">

      {/* BACKGROUND */}

      <div className="stars stars-one"></div>
      <div className="stars stars-two"></div>
      <div className="stars stars-three"></div>

      <div className="bg-orb orb-one"></div>
      <div className="bg-orb orb-two"></div>
      <div className="bg-orb orb-three"></div>

      {/* HEADER */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <div>
            <h1>
              ML POWERED STRESS SCORE
            </h1>

            <p>
              PREDICTION WEB APPLICATION
            </p>
          </div>

        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          AI SYSTEM ONLINE
        </div>

      </header>


      {/* MAIN */}

      <main className="main-content">

        {/* LEFT SIDE */}

        <section className="hero-section">

          <div className="visual-card">

            <div className="visual-grid"></div>

            {/* PLANET */}

            <div className="planet planet-one"></div>
            <div className="planet planet-two"></div>

            {/* STUDENT */}

            <div className="student-scene">

              <div className="student-glow"></div>

              <div className="student">

                <div className="head">
                  <div className="hair"></div>
                  <div className="face"></div>
                  <div className="eye eye-one"></div>
                  <div className="eye eye-two"></div>
                </div>

                <div className="neck"></div>

                <div className="body">

                  <div className="shirt-line"></div>

                  <div className="arm arm-left"></div>
                  <div className="arm arm-right"></div>

                </div>

                <div className="laptop">

                  <div className="screen">
                    <div className="screen-glow"></div>
                  </div>

                  <div className="keyboard"></div>

                </div>

              </div>

              {/* STRESS WAVES */}

              <div className="stress-ring ring-one"></div>
              <div className="stress-ring ring-two"></div>
              <div className="stress-ring ring-three"></div>

            </div>


            {/* FLOATING HUD */}

            <div className="hud-card hud-sleep">
              <span className="hud-icon">◐</span>
              <div>
                <small>SLEEP</small>
                <strong>6.0 hrs</strong>
              </div>
            </div>

            <div className="hud-card hud-screen">
              <span className="hud-icon">▣</span>
              <div>
                <small>SCREEN TIME</small>
                <strong>5.2 hrs</strong>
              </div>
            </div>

            <div className="hud-card hud-study">
              <span className="hud-icon">◇</span>
              <div>
                <small>STUDY</small>
                <strong>6.0 hrs</strong>
              </div>
            </div>


            <div className="stress-warning">

              <span className="warning-dot"></span>

              <div>
                <small>STUDENT STATE</small>
                <strong>STRESS DETECTED</strong>
              </div>

            </div>


            <div className="scene-caption">
              <span>01</span>
              <p>
                STUDENT WELLNESS<br />
                INTELLIGENCE
              </p>
            </div>

          </div>


          {/* HERO TEXT */}

          <div className="hero-text">

            <p className="eyebrow">
              UNDERSTAND YOUR MIND
            </p>

            <h2>
              Your Mental Health
              <br />
              <span>Matters.</span>
            </h2>

            <p className="description">
              Analyze your daily lifestyle and receive an
              AI-powered stress score with personalized
              wellness guidance.
            </p>

            <div className="hero-points">

              <div>
                <span>01</span>
                AI ANALYSIS
              </div>

              <div>
                <span>02</span>
                RISK INSIGHT
              </div>

              <div>
                <span>03</span>
                WELLNESS GUIDE
              </div>

            </div>

          </div>

        </section>


        {/* RIGHT FORM */}

        <section className="form-section">

          <div className="glass-card">

            <div className="form-header">

              <div>

                <p className="form-eyebrow">
                  ML PREDICTION
                </p>

                <h3>
                  STUDENT WELLNESS
                  <span> ANALYSIS</span>
                </h3>

                <p className="form-description">
                  Enter your lifestyle information
                </p>

              </div>

              <div className="form-number">
                01
              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="error-box">

                <span>!</span>

                <div>
                  <strong>Prediction Error</strong>
                  <p>{error}</p>
                </div>

              </div>
            )}


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* AGE */}

                <div className="input-group">

                  <label>Age</label>

                  <input
                    type="number"
                    name="age"
                    min="10"
                    max="100"
                    placeholder="18"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />

                  <span className="input-line"></span>

                </div>


                {/* GENDER */}

                <div className="input-group">

                  <label>Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                  </select>

                </div>


                {/* COUNTRY */}

                <div className="input-group">

                  <label>Country</label>

                  <input
                    type="text"
                    name="country"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* ACADEMIC LEVEL */}

                <div className="input-group">

                  <label>Academic Level</label>

                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select level
                    </option>

                    <option value="High School">
                      High School
                    </option>

                    <option value="Undergraduate">
                      Undergraduate
                    </option>

                    <option value="Postgraduate">
                      Postgraduate
                    </option>

                  </select>

                </div>


                {/* PLATFORM */}

                <div className="input-group">

                  <label>Most Used Platform</label>

                  <select
                    name="mostUsedPlatform"
                    value={formData.mostUsedPlatform}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select platform
                    </option>

                    <option value="Instagram">
                      Instagram
                    </option>

                    <option value="Twitter">
                      Twitter
                    </option>

                    <option value="Facebook">
                      Facebook
                    </option>

                    <option value="TikTok">
                      TikTok
                    </option>

                    <option value="YouTube">
                      YouTube
                    </option>

                    <option value="Snapchat">
                      Snapchat
                    </option>

                    <option value="Reddit">
                      Reddit
                    </option>

                  </select>

                </div>


                {/* PURPOSE */}

                <div className="input-group">

                  <label>Purpose Of Use</label>

                  <select
                    name="purposeOfUse"
                    value={formData.purposeOfUse}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select purpose
                    </option>

                    <option value="Entertainment">
                      Entertainment
                    </option>

                    <option value="Education">
                      Education
                    </option>

                    <option value="Social">
                      Social
                    </option>

                    <option value="Information">
                      Information
                    </option>

                    <option value="Professional">
                      Professional
                    </option>

                  </select>

                </div>


                {/* DAILY USAGE */}

                <div className="input-group">

                  <label>Daily Usage Hours</label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    name="averageUsage"
                    placeholder="5.5"
                    value={formData.averageUsage}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* UNLOCKS */}

                <div className="input-group">

                  <label>Daily Unlocks</label>

                  <input
                    type="number"
                    min="0"
                    name="dailyUnlocks"
                    placeholder="40"
                    value={formData.dailyUnlocks}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* STUDY */}

                <div className="input-group">

                  <label>Study Hours</label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    name="studyHours"
                    placeholder="6"
                    value={formData.studyHours}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* PHYSICAL ACTIVITY */}

                <div className="input-group">

                  <label>Physical Activity Hours</label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    name="physicalActivity"
                    placeholder="1"
                    value={formData.physicalActivity}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* SLEEP */}

                <div className="input-group full-width-field">

                  <label>
                    Sleep Hours Per Night
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    name="sleepHours"
                    placeholder="7"
                    value={formData.sleepHours}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* STRESS */}

                <div className="input-group full-width-field">

                  <label>
                    Self Reported Stress Level
                  </label>

                  <select
                    name="stressLevel"
                    value={formData.stressLevel}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select stress level
                    </option>

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Very High">
                      Very High
                    </option>

                  </select>

                </div>

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="btn-predict"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="loader"></span>
                    ANALYZING...
                  </>
                ) : (
                  <>
                    PREDICT MY STRESS SCORE
                    <span>→</span>
                  </>
                )}

              </button>

            </form>


            {/* RESULT */}

            {result && (

              <div
                className={`result-card ${getRiskClass(
                  result.stress_category
                )}`}
              >

                <div className="result-header">

                  <div>
                    <p>
                      PREDICTION COMPLETE
                    </p>

                    <h4>
                      YOUR STRESS PROFILE
                    </h4>
                  </div>

                  <span className="result-check">
                    ✓
                  </span>

                </div>


                <div className="score-section">

                  <div className="score-circle">

                    <div>
                      <strong>
                        {result.predicted_mental_health_score}
                      </strong>

                      <span>
                        / 10
                      </span>
                    </div>

                  </div>


                  <div className="risk-section">

                    <small>
                      RISK LEVEL
                    </small>

                    <strong>
                      {result.stress_category}
                    </strong>

                  </div>

                </div>


                <div className="recommendation">

                  <div className="recommendation-title">
                    WELLNESS GUIDANCE
                  </div>

                  <p>
                    {result.recommendation}
                  </p>

                </div>


                <div className="result-note">
                  This prediction is an ML-based estimate and
                  is not a medical diagnosis.
                </div>


                <button
                  type="button"
                  className="reset-button"
                  onClick={resetForm}
                >
                  ↻ RUN ANOTHER ANALYSIS
                </button>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <div>
          <span>
            AI POWERED
          </span>

          <span>
            STUDENT WELLNESS
          </span>

          <span>
            ML PREDICTION
          </span>
        </div>

        <strong>
          Made by VICKY SHARMA
        </strong>

      </footer>

    </div>
  );
}

export default App;