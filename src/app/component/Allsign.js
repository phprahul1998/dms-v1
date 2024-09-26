import { useRef, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../assets/css/sign.css";
import Modal from "react-bootstrap/Modal";
const Allsign = ({ onAdoptSignature }) => {
  const [show, setShow] = useState(false);
  const [signature, setSignature] = useState(null);
  const [penColor, setPenColor] = useState("black");
  const [previewImage, setFile] = useState();
  const inputFile = useRef(null);
  const sigCanvas = useRef(null);
  const fonts = [
    { id: 1, fontFamily: "Brush Script MT, cursive" },
    { id: 2, fontFamily: "Roboto, sans-serif" },
    { id: 3, fontFamily: "Caveat, cursive" },
    { id: 4, fontFamily: "Dancing Script, cursive" },
    { id: 5, fontFamily: "Lobster, cursive" },
    { id: 6, fontFamily: "Pacifico, cursive" },
    { id: 7, fontFamily: "Satisfy, cursive" },
    { id: 8, fontFamily: "Great Vibes, cursive" },
  ];
  const [name, setName] = useState("Your Name");
  const [datetime, setDatetime] = useState(new Date().toLocaleDateString());
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [selectedFont, setSelectedFont] = useState(fonts[0].fontFamily);
  const [signatureType, setSignatureType] = useState("Signatures"); // NEW STATE FOR SIGNATURE TYPE
  const handleClose = () => setShow(false);
  const handleShow = (type) => {
    setSignatureType(type); 
    setShow(true);
  };

  const saveSignature = () => {
    if (sigCanvas.current) {
      const dataUrl = sigCanvas.current.toDataURL("image/png");
      setSignature(dataUrl);
      onAdoptSignature(dataUrl);
      handleClose();
    }
  };

  const saveTypedSignature = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 200;
    ctx.font = `60px ${selectedFont}`;
    ctx.fillStyle = selectedColor;
    ctx.fillText(name, 10, 100);
    const dataUrl = canvas.toDataURL("image/png");
    setSignature(dataUrl);
    onAdoptSignature(dataUrl);
    handleClose();
  };

  const saveUploadedSignature = () => {
    if (previewImage) {
      onAdoptSignature(previewImage);
      handleClose();
    }
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignature(null);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleDatetime =(e)=>{
    setDatetime(e.target.value);

  }

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font.fontFamily);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileChange = async (event) => {
    const fileUploaded = event.target.files[0];
    setFile(URL.createObjectURL(fileUploaded));
  };
  const handleRemovePreviewImage = (e) => {
    setFile();
    inputFile.current.value = null;
  };

  const saveDateSignature = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 100;
    ctx.font = "20px Arial"; 
    ctx.fillStyle = "#000"; 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(datetime, canvas.width / 2, canvas.height / 2);
    const dataUrl = canvas.toDataURL("image/png");
    onAdoptSignature(dataUrl);
    handleClose();
  };

  const getTabsToShow = () => {
    switch (signatureType) {
      case "Signatures":
        return ["Type", "Upload", "Saved"];
      case "Stamp":
        return ["Upload", "Saved"];
      case "Initials":
        return ["Type", "Saved"];
      case "Date Signed":
        return ["Date"];
      default:
        return ["Type", "Upload", "Saved"];
    }
  };
  

  const availableTabs = getTabsToShow();

  return (
    <>
      <div className="row">
        <div className="col-6">
          <div className="d-flex signuture" onClick={() => handleShow("Signatures")}>
            <div className="lasIcon">
              <i className="las la-signature"></i>
            </div>
            <div className="text">
              <h6>Signatures</h6>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex signuture" onClick={() => handleShow("Stamp")}>
            <div className="lasIcon">
              <i className="las la-stamp"></i>
            </div>

            <div className="text">
              <h6>Stamp</h6>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex signuture" onClick={() => handleShow("Initials")}>
            <div className="lasIcon">
              <i className="las la-signature"></i>
            </div>

            <div className="text">
              <h6>Initials</h6>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex signuture" onClick={() => handleShow("Date Signed")}>
            <div className="lasIcon">
              <i className="las la-calendar"></i>
            </div>

            <div className="text">
              <h6>Date Signed</h6>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey={availableTabs[0]} id="justify-tab-example" className="mb-3" justify>
            {availableTabs.includes("Type") && (
              <Tab eventKey="Type" title="Type">
                <div className="d-flex">
                    <div>
                    <input
                  type="text"
                  id="fullName"
                  className="mb-4"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your full name"
                />
                    </div>
                    <div className="ms-auto colorPicker">
                      <small>Pick colour</small>
                    <input
                    type="color"
                    id="colorPicker"
                    value={selectedColor}
                    onChange={handleColorChange}
                  />
                    </div>
                </div>
               
                
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {fonts.map((font) => (
                    <div
                      key={font.id}
                      className="typeDive"
                      onClick={() => handleFontSelect(font)}
                      style={{
                        fontFamily: font.fontFamily,
                        color: selectedColor,
                        padding: "10px",
                        border: selectedFont === font.fontFamily ? "2px solid blue" : "1px solid gray",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>

                <div style={{ float: "right" }}>
                  <button className="btn btn-secondary btn-sm mr-2" onClick={handleClose}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={saveTypedSignature}>
                    Adopt
                  </button>
                </div>
              </Tab>
            )}
            {availableTabs.includes("Upload") && (
              <Tab  eventKey="Upload" title="Upload">
                <div className="drop_sign">
                  {previewImage && (
                    <>
                      <img className="previewImage" src={previewImage} alt="Uploaded Signature" />
                      <span onClick={() => handleRemovePreviewImage()}>
                        <i className="las la-times-circle"></i>
                      </span>
                    </>
                  )}
                  {!previewImage && (
                    <>
                      <img src="/drop_sign.png" alt="Drop Signature" />
                      <p>
                        Choose a file from
                        <span onClick={onButtonClick}> your desktop </span>
                        to upload a photo or scan of a signature
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div className="mt-2" style={{ float: "right" }}>
                  <button className="btn btn-secondary btn-sm mr-2" onClick={handleClose}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={saveUploadedSignature}>
                    Adopt
                  </button>
                </div>
              </Tab>
            )}

            {availableTabs.includes("Saved") && (
              <Tab eventKey="Saved" title="Saved">
                {/* Implement saved signatures if needed */}
              </Tab>
            )}

            {availableTabs.includes("Date") && (
              <Tab style={{width:'50%'}} eventKey="Date" title="Date">
                <div className="text-center">
                <input
                  type="date"
                  id="fullName"
                  value={datetime}
                  onChange={handleDatetime}
                />
                </div>
                <div className="mt-2" style={{ float: "right" }}>
                  <button className="btn btn-secondary btn-sm mr-2" onClick={handleClose}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={saveDateSignature}>
                    Adopt
                  </button>
                </div>
              </Tab>
            )}
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Allsign;
