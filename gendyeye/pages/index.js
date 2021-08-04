import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};
const Home = () => {
  const webcamRef = useRef(null);
  const [predict, setPredict] = useState(null);
  const prediction = (data) => {
    axios
      .post("https://lab.ggolfz.codes/api/predict", { data: data })
      .then((res) => {
        if (res.data.success) {
          setPredict({
            gender: res.data.gender,
            confident: res.data.confident,
          });
        }
      });
  };
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      predict(imageSrc);
    }
  }, [webcamRef]);
  const handleClickUpload = () => {
    document.getElementById("fileUpload").click();
  };
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      var reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          prediction(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        width: "100vw",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Gender prediction from Eye</h1>
      <p style={{ textAlign: "center" }}>
        Put your eye to camera like this image
        <br /> <br />{" "}
        <img alt="example" width="100px" height="100px" src="example.jpg" />
      </p>
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>
      <button style={{ padding: ".5rem", margin: ".5rem" }} onClick={capture}>
        Predict
      </button>
      <input
        type="file"
        accept="image/*"
        id="fileUpload"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      ></input>
      <button onClick={handleClickUpload}>Upload</button>
      {predict ? (
        <div>
          I am {Math.round(predict.confident * 10000) / 100}% confident that you
          are {predict.gender}.
        </div>
      ) : null}
    </div>
  );
};

export default Home;
