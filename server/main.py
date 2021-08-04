from flask import Flask,request
import cv2
import io
import base64
import numpy as np
from PIL import Image
from keras.models import load_model
app = Flask(__name__)
model_data = [['old-model.h5',53],['model.h5',100]]
config= model_data[1]
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        img = cv2.cvtColor(np.array(Image.open(io.BytesIO(base64.b64decode(data['data'].split('base64,')[1])))), cv2.COLOR_BGR2RGB)
        prediction = prediction_img(img)
    except:
        return {"success":False,"gender":"unknown","confident":0}
    return {"success": True,"gender":prediction[0],"confident":float(prediction[1])}

def prediction_img(image):
  img = cv2.resize(image,(config[1],config[1]))
  img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  img = img / 255
  img = img.reshape(config[1]**2)
  pred = model.predict(np.array([img]))
  print(f'Male: {pred[0][0]*100}% Female: {pred[0][1]*100}')
  if pred[0][0] >= pred[0][1]:
    return ['Male',pred[0][0]]
  else:
    return ['Female',pred[0][1]]

if __name__ == '__main__':
    model = load_model(config[0])
    app.run(debug=True, host='0.0.0.0')