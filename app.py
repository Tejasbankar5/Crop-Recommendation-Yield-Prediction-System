from flask import Flask, render_template, request
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# ==============================
# Load both models
# ==============================
try:
    classification_model = pickle.load(open("crop_classification_model.pkl", "rb"))
    yield_model = pickle.load(open("yield_regression_model.pkl", "rb"))
except FileNotFoundError as e:
    print(f"Model loading error: {e}")
    # You might want to handle this more gracefully in production

# Label decoder for classification
label_decoder = {
    0: 'rice', 1: 'maize', 2: 'chickpea', 3: 'kidneybeans', 4: 'pigeonpeas',
    5: 'mothbeans', 6: 'mungbean', 7: 'blackgram', 8: 'lentil', 9: 'pomegranate',
    10: 'banana', 11: 'mango', 12: 'grapes', 13: 'watermelon', 14: 'muskmelon',
    15: 'apple', 16: 'orange', 17: 'papaya', 18: 'coconut', 19: 'cotton',
    20: 'jute', 21: 'coffee'
}

# Reverse mapping for yield prediction
crop_to_index = {v: k for k, v in label_decoder.items()}

# ==============================
# Routes
# ==============================
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend')
def recommend():
    return render_template('recommend.html')

# FIXED: Added the missing yield prediction route
@app.route('/yield_prediction')  # This was missing in your original code
def yield_prediction():
    return render_template('yield.html')

# ==============================
# Crop Recommendation Prediction
# ==============================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get form data with validation
        form_data = {
            'N': float(request.form['N']),
            'P': float(request.form['P']),
            'K': float(request.form['K']),
            'temperature': float(request.form['temperature']),
            'humidity': float(request.form['humidity']),
            'ph': float(request.form['ph']),
            'rainfall': float(request.form['rainfall'])
        }
        
        input_data = pd.DataFrame([list(form_data.values())], 
                                columns=form_data.keys())
        
        prediction = classification_model.predict(input_data)[0]
        crop_name = label_decoder.get(int(prediction), "Unknown Crop")
        
        return render_template('recommend.html', 
                             result=f"🌱 Recommended Crop: {crop_name.capitalize()}",
                             form_data=form_data)  # Pass back form data to maintain values
                             
    except Exception as e:
        return render_template('recommend.html', 
                             result=f"⚠️ Error: {str(e)}")

# ==============================
# Crop Yield Prediction - IMPROVED VERSION
# ==============================
@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    try:
        # Get numerical inputs
        numerical_data = {
            'N': float(request.form['N']),
            'P': float(request.form['P']),
            'K': float(request.form['K']),
            'temperature': float(request.form['temperature']),
            'humidity': float(request.form['humidity']),
            'ph': float(request.form['ph']),
            'rainfall': float(request.form['rainfall'])
        }
        
        crop_label = request.form['label'].lower().strip()
        
        # Create feature array - ADAPT BASED ON YOUR ACTUAL MODEL REQUIREMENTS
        # This is a more flexible approach
        feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # Add crop encoding (adjust based on how your model was trained)
        if hasattr(yield_model, 'feature_names_in_'):
            # Model has feature names (newer scikit-learn)
            feature_columns_full = yield_model.feature_names_in_
            input_features = []
            
            for col in feature_columns_full:
                if col in numerical_data:
                    input_features.append(numerical_data[col])
                elif col.startswith('label_'):
                    # One-hot encoding for crop type
                    crop_feature = 1 if col == f'label_{crop_label}' else 0
                    input_features.append(crop_feature)
                else:
                    input_features.append(0)  # Default value for missing features
        else:
            # Fallback: assume the model expects numerical features only
            # You might need to encode the crop label differently
            input_features = list(numerical_data.values())
            # Add crop index as a feature (adjust based on your model training)
            input_features.append(crop_to_index.get(crop_label, 0))
        
        # Make prediction
        prediction = yield_model.predict([input_features])[0]
        predicted_yield = max(0, round(prediction, 2))  # Ensure non-negative yield
        
        return render_template('yield.html', 
                             result=f"🌾 Estimated Yield: {predicted_yield} kg/acre",
                             form_data=request.form)  # Pass back form data
                             
    except Exception as e:
        return render_template('yield.html', 
                             result=f"⚠️ Error: {str(e)}")

# ==============================
# Run App
# ==============================
if __name__ == '__main__':
    app.run(debug=True)