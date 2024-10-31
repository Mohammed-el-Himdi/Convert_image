import './App.css';
import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import photo from './photos.png';
import photo2 from './limage-de-marque.png';
import photo3 from './securite.png';
import photo4 from './add-image.png';
import Footer from './components/Footer'; // Correct import path
import Header from './components/Header';

function App() {
  const [imageFiles, setImageFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [convertedImages, setConvertedImages] = useState([]);
  const [originalFileNames, setOriginalFileNames] = useState([]);
  const [quality, setQuality] = useState(0.8);
  const [showConfirm, setShowConfirm] = useState(false);
  const canvasRef = useRef(null);

  const supportedFormats = [
    "3fr", "arw", "avif", "bmp", "cr2", "cr3", "crw", "dcr", "dng", "eps",
    "erf", "gif", "heic", "heif", "icns", "ico", "jfif", "jpeg", "jpg", "mos",
    "mrw", "nef", "odd", "odg", "orf", "pef", "png", "ppm", "ps", "psd", "raf",
    "raw", "rw2", "tif", "tiff", "webp", "x3f", "xcf", "xps", "html", "svg", "indd"
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map(file => URL.createObjectURL(file));
    const fileNames = files.map(file => file.name.split('.').slice(0, -1).join('.'));

    setImageFiles(imageURLs);
    setConvertedImages([]);
    setOriginalFileNames(fileNames);
  };

  const handleFormatClick = (format) => {
    if (outputFormat && outputFormat !== format) {
      setConvertedImages([]);
    }
    
    setOutputFormat(format);
    setShowConfirm(true);
  };

  const handleImageConversion = () => {
    setShowConfirm(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const isTransparentSupported = ["png", "gif", "webp"].includes(outputFormat);

    imageFiles.forEach((imageFile, index) => {
      const img = new Image();
      img.src = imageFile;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let convertedImage;

        if (outputFormat === "pdf") {
          const pdf = new jsPDF();
          pdf.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 10, 10, img.width / 5, img.height / 5);
          convertedImage = pdf.output("bloburl");
        } else if (outputFormat === "html") {
          const base64Image = canvas.toDataURL();
          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Converted Image</title>
              </head>
              <body>
                <h2>Converted Image</h2>
                <img src="${base64Image}" alt="Converted Image" style="max-width:100%;" />
              </body>
            </html>
          `;
          const blob = new Blob([htmlContent], { type: "text/html" });
          convertedImage = URL.createObjectURL(blob);
        } else {
          const format = outputFormat === "jpg" ? "jpeg" : outputFormat;
          if (!isTransparentSupported && ctx.getImageData(0, 0, canvas.width, canvas.height).data[3] === 0) {
            alert(`Warning: ${outputFormat.toUpperCase()} does not support transparency. Background will be solid.`);
          }
          convertedImage = canvas.toDataURL(`image/${format}`, quality);
        }

        setConvertedImages(prevImages => [...prevImages, { url: convertedImage, fileName: originalFileNames[index] }]);
      };
    });
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setConvertedImages(prevImages => prevImages.filter((_, i) => i !== index));
    setOriginalFileNames(prevNames => prevNames.filter((_, i) => i !== index));
  };

  return (
  <div>
      <Header/>
    <div className="App">
      
      {/* Instructions Section */}
      <div className="instructions-section">
        <h2>How to Convert Images?</h2>
        <ol>
          <li>Click the <strong>“Choose Files”</strong> button to upload your files.</li>
          <li>Select a target image format from the <strong>“Convert To”</strong> buttons.</li>
          <li>Click on the blue <strong>“Confirm Conversion”</strong> button to start the conversion.</li>
        </ol>
      </div>

      {/* File Upload and Image Previews */}
      <div className="converter-card">
      <label className="custom-file-upload">
      <img src={photo4} alt="Add image" style={{ width: '30px', height: 'auto' }} />
  <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
  Choose Files
</label>
        
        {["jpeg", "jpg", "webp"].includes(outputFormat) && (
          <div>
            <label>
              Quality: {Math.round(quality * 100)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
              />
            </label>
          </div>
        )}

        {showConfirm && (
          <button onClick={handleImageConversion}>Confirm Conversion to {outputFormat.toUpperCase()}</button>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="image-container">
          {imageFiles.length > 0 && (
            <div className="original-images">
              <h2>Original Images</h2>
              <div className="image-preview">
                {imageFiles.map((file, index) => (
                  <div key={index} className="image-item">
                    <img src={file} alt={`Original ${index + 1}`} />
                    <button className="remove-button" onClick={() => handleRemoveImage(index)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {convertedImages.length > 0 && (
            <div className="converted-images">
              <h2>Converted Images</h2>
              {convertedImages.map((convertedImage, index) => (
                <div key={index} className="converted-image-item">
                  <div className="image-preview">
                    <img src={convertedImage.url} alt={`Converted ${index + 1}`} />
                  </div>
                  <div className="download-container">
                    <a href={convertedImage.url} download={`${convertedImage.fileName}.${outputFormat}`}>
                      <button className="download-button">Download</button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Output Format Buttons in Fieldset for Square Layout */}
      <fieldset className="format-fieldset">
        <legend>Select Output Format</legend>
        <div className="format-links">
          {supportedFormats.map((format) => (
            <button key={format} onClick={() => handleFormatClick(format)}>
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Features Section */}
      <div className="features-section">
      <div className="feature-row">
        <div className="feature">
          <img src={photo} alt="Convert Any Image" style={{ width: '40px', height: 'auto' }} />
          <h3>Convert Any Image</h3>
          <p>Convert more than 500+ image formats into popular formats like JPG, PNG, WebP, and more.</p>
        </div>
        <div className="feature">
          <img src={photo2} alt="Best Image Converter" />
          <h3>Best Image Converter</h3>
          <p>Convert your images with perfect quality, size, and compression. You can also batch convert images.</p>
        </div>
        <div className="feature">
          <img src={photo3} alt="Free & Secure" />
          <h3>Free & Secure</h3>
          <p>Our Image Converter is free and works on any web browser. Files are protected with 256-bit SSL encryption.</p>
        </div>
      </div>
    </div>
    </div>
    <Footer/>
    </div>
  );
}

export default App;