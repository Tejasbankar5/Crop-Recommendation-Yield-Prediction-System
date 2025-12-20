
# 🌾 Crop Recommendation & Yield Prediction System

A Machine Learning-based web application that helps farmers and agriculture planners by:

* **Recommending the best crop** to grow based on soil and environmental conditions.
* **Predicting expected crop yield** based on selected crop and parameters.

This system improves decision-making, increases productivity, and promotes smart farming using data-driven insights.

---

## ✅ Features

### 🌱 Crop Recommendation

Predicts the most suitable crop based on:

* Nitrogen (N)
* Phosphorus (P)
* Potassium (K)
* Soil pH
* Temperature
* Humidity
* Rainfall

Uses a classification model to recommend the best crop for given conditions.

---

### 🌾 Yield Prediction

Predicts **expected crop yield** based on:

* Selected Crop
* Environmental Conditions
* Land / Area Inputs
* Soil Nutrients

Uses regression models (RandomForest / DecisionTree Regressor).

---

### 🖥 Web Application

* Built with **Flask**
* Simple and user-friendly interface
* Real-time prediction output
* Error handling & input validation

---

## 🛠 Tech Stack

**Programming Language**

* Python

**ML Libraries**

* Scikit-Learn
* Pandas
* NumPy

**Web Framework**

* Flask

**Model Persistence**

* Pickle (`.pkl` models)

**Frontend**

* HTML / CSS / Bootstrap (or your UI stack)

---

## 📁 Project Structure

```
Project/
 ├── app.py
 ├── models/
 │    ├── crop_recommendation_model.pkl
 │    └── yield_prediction_model.pkl
 ├── templates/
 │    └── *.html
 ├── static/
 ├── dataset/
 ├── requirements.txt
 └── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/Tejasbankar5/Crop-Recommendation-Yield-Prediction-System.git
cd Crop-Recommendation-Yield-Prediction-System
```

---

### 2️⃣ Create Virtual Environment (Recommended)

```
python -m venv venv
venv\Scripts\activate     # Windows
source venv/bin/activate  # Mac/Linux
```

---

### 3️⃣ Install Requirements

```
pip install -r requirements.txt
```

---

### 4️⃣ Run Application

```
python app.py
```

Open browser:

```
http://127.0.0.1:5000
```

---

## 🔮 Future Enhancements

* Live weather API integration
* Region-based prediction
* Fertilizer recommendation
* Mobile Application
* Dashboard analytics
* Multi-language support

---



## 📜 License

For educational & project use. Permission required for commercial deployment.
