import { useRef, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SignatureCanvas from 'react-signature-canvas'

import '../assets/css/sign.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const Allsign = ({ handleDragStart }) => {
    const [show, setShow] = useState(false);
    const [signature, setSignature] = useState(null);
    const [penColor, setPenColor] = useState('black'); // Default color is black
    const sigCanvas = useRef(null);
    const fonts = [
        { id: 1, fontFamily: 'Brush Script MT, cursive' },
        { id: 2, fontFamily: 'Roboto, sans-serif' },
        { id: 3, fontFamily: 'Caveat, cursive' },
        { id: 4, fontFamily: 'Dancing Script, cursive' },
        { id: 5, fontFamily: 'Lobster, cursive' },
        { id: 6, fontFamily: 'Pacifico, cursive' },
        { id: 7, fontFamily: 'Satisfy, cursive' },
        { id: 8, fontFamily: 'Great Vibes, cursive' },
    ];
    const [name, setName] = useState('Your Name');
    const [selectedColor, setSelectedColor] = useState('#FF0000');
    const [selectedFont, setSelectedFont] = useState(fonts[0].fontFamily);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const availableSignatures = [
        { id: 1, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5WzhSyQHRKmDj4BwcyqL3yZVadRwfAkBpQ&s', width: 100, height: 50 }, // Example image
        { id: 2, src: 'https://www.jsign.com/wp-content/uploads/2022/06/graphic-signature-completeness.png', width: 100, height: 50 },
        { id: 2, src: 'https://www.jsign.com/wp-content/uploads/2022/06/graphic-signature-completeness.png', width: 100, height: 50 },
        { id: 2, src: 'https://www.jsign.com/wp-content/uploads/2022/06/graphic-signature-completeness.png', width: 100, height: 50 },
        { id: 2, src: 'https://www.jsign.com/wp-content/uploads/2022/06/graphic-signature-completeness.png', width: 100, height: 50 }
    ];
    const saveSignature = () => {
        if (sigCanvas.current) {
            const dataUrl = sigCanvas.current.toDataURL('image/png');
            setSignature(dataUrl);
        }
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
        setSignature(null);
    };
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };

    const handleFontSelect = (font) => {
        setSelectedFont(font.fontFamily);
    };

    return (
        <>
            <div className='row'>
                <div className='col-6'>
                    <div className='d-flex signuture' onClick={handleShow}>
                        <div className='lasIcon' >
                            <i className="las la-signature"></i>
                        </div>

                        <div className='text'>
                            <h6>Signatures</h6>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex signuture'>
                        <div className='lasIcon' >
                            <i className="las la-stamp"></i>
                        </div>

                        <div className='text'>
                            <h6>Stamp</h6>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex signuture'>
                        <div className='lasIcon' >
                            <i className="las la-signature"></i>
                        </div>

                        <div className='text'>
                            <h6>Initials</h6>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex signuture'>
                        <div className='lasIcon' >
                            <i className="las la-calendar"></i>
                        </div>

                        <div className='text'>
                            <h6>Date Signed</h6>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        defaultActiveKey="Draw"
                        id="justify-tab-example"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="Draw" title="Draw">
                            <SignatureCanvas
                                ref={sigCanvas}
                                canvasProps={{ width: 470, height: 200, className: 'signatureCanvas' }}
                                backgroundColor="#f4f4f4"
                                penColor={penColor}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <input
                                    type="color"
                                    id="penColor"
                                    className=''
                                    value={penColor}
                                    onChange={(e) => setPenColor(e.target.value)}
                                />
                                <div style={{ float: 'right' }}>
                                    <button className='btn btn-secondary btn-sm mr-2' onClick={clearSignature}>Clear</button>
                                    <button className='btn btn-primary btn-sm' onClick={saveSignature}>Adopt</button>
                                </div>
                            </div>

                        </Tab>
                        <Tab eventKey="Type" title="Type">

                            <label htmlFor="fullName">Your Full Name: <input
                                type="color"
                                id="colorPicker"
                                value={selectedColor}
                                onChange={handleColorChange}
                            /></label>
                            <input
                                type="text"
                                id="fullName"
                                className='form-control mb-4'
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter your full name"
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {fonts.map((font) => (
                                    <div
                                        key={font.id}
                                        onClick={() => handleFontSelect(font)}
                                        style={{
                                            fontFamily: font.fontFamily,
                                            color: selectedColor,
                                            padding: '10px',
                                            border: selectedFont === font.fontFamily ? '2px solid blue' : '1px solid gray',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>

                            <div style={{ float: 'right' }}>
                                <button className='btn btn-secondary btn-sm mr-2' onClick={clearSignature}>Clear</button>
                                <button className='btn btn-primary btn-sm' onClick={saveSignature}>Adopt</button>
                            </div>
                        </Tab>
                        <Tab eventKey="upload" title="Upload">
                            Upload
                        </Tab>
                        <Tab eventKey="Saved" title="Saved" >
                            Saved
                        </Tab>
                    </Tabs>
                </Modal.Body>

            </Modal>

        </>
    )

}
export default Allsign;
