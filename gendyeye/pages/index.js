import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};
const Home = () => {
  const webcamRef = useRef(null);
  const [predict, setPredict] = useState(null);
  const [img, setImg] = useState(null);
  const [croppedImg, setCroppedImg] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    aspect: 1,
    width: 100,
    height: 100,
  });
  const getCropImage = (data) => {
    setCrop(data);
    const canvas = document.createElement("canvas");
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = img;
    image.onload = () => {
      ctx.drawImage(
        image,
        data.x,
        data.y,
        data.width,
        data.height,
        0,
        0,
        data.width,
        data.height
      );
      setCroppedImg(canvas.toDataURL());
    };
  };
  const prediction = async () => {
    if (croppedImg) {
      console.log(croppedImg);
      await axios
        .post("https://lab.ggolfz.codes/gendy-api/predict", { data: croppedImg })
        .then((res) => {
          if (res.data.success) {
            clearImage();
            setPredict({
              gender: res.data.gender,
              confident: res.data.confident,
            });
          }
        });
    }
  };
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImg(imageSrc);
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
          setImg(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setImg(null);
    setCroppedImg(null);
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
      <h5 style={{margin:0}}>(Made for education purposes on learning convolutional neural networks)</h5>
      <p style={{ textAlign: "center" }}>
        Take an image or upload like this to predict your gender.
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
        Capture
      </button>
      or
      <input
        type="file"
        accept="image/*"
        id="fileUpload"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      ></input>
      <button
        style={{ padding: ".5rem", margin: ".5rem" }}
        onClick={handleClickUpload}
      >
        Upload
      </button>
      {predict ? (
        <div>
          I am {Math.round(predict.confident * 10000) / 100}% confident that you
          are {predict.gender}.
        </div>
      ) : null}
      {img ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            width: "100vw",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="content"
            style={{
              background: "#FFF",
              width: "400px",
              height: "450px",
              zIndex: 1,
              display: "flex",
              flexFlow: "column",
              alignItems:'center',
              padding: "1rem 2rem"
            }}
          >
            <h2>Crop Your Image</h2>
            <div>
            <ReactCrop
              src={img}
              crop={crop}
              onChange={setCrop}
              onComplete={getCropImage}
            />
            </div>
            <div style={{textAlign:'center'}}>
              <button
                style={{ padding: ".5rem", margin: ".5rem" }}
                onClick={prediction}
              >
                Predict
              </button>
            </div>
          </div>
          <div
            className="backdrop"
            onClick={clearImage}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: "#0005",
              width: "100vw",
              height: "100vh",
            }}
          ></div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
