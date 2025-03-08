import React, { useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SketchPicker } from "react-color";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CertificateBuilder.css";

const CertificateBuilder = () => {
  const [certificateData, setCertificateData] = useState({
    recipientName: "",
    certificateTitle: "",
    date: "",
    issuer: "",
    certificateNumber: "",
    logo: null,
  });

  const [styles, setStyles] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    titleColor: "#2c3e50",
    fontFamily: "Arial",
  });

  const [template, setTemplate] = useState("template1");
  const [errors, setErrors] = useState({});
  const certificateRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!certificateData.recipientName) newErrors.recipientName = "Required";
    if (!certificateData.certificateTitle)
      newErrors.certificateTitle = "Required";
    if (!certificateData.date) newErrors.date = "Required";
    if (!certificateData.issuer) newErrors.issuer = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCertificateData((prev) => ({ ...prev, logo: null }));
  };

  const handleDownload = () => {
    if (!validateForm()) return;

    html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Certificate.pdf");
    });
  };

  const certificateStyles = {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    fontFamily: styles.fontFamily,
  };

  // [Keeping all template render functions unchanged...]
  const renderTemplate1 = () => (
    <div className="certificate-content template1">
      {certificateData.logo && (
        <img
          src={certificateData.logo}
          alt="Logo"
          className="certificate-logo"
        />
      )}
      <h1>Certificate of Completion</h1>
      <p>This certifies that</p>
      <h2>{certificateData.recipientName || "Recipient Name"}</h2>
      <p>has successfully completed</p>
      <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      <p>Issued on: {certificateData.date || "Date"}</p>
      <p>By: {certificateData.issuer || "Issuer"}</p>
      <p>Certificate #: {certificateData.certificateNumber || "Number"}</p>
    </div>
  );

  const renderTemplate2 = () => (
    <div className="certificate-content template2">
      {certificateData.logo && (
        <img
          src={certificateData.logo}
          alt="Logo"
          className="certificate-logo"
        />
      )}
      <h1>Achievement Certificate</h1>
      <h2>{certificateData.recipientName || "Recipient Name"}</h2>
      <p>For excellence in</p>
      <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      <div className="template2-details">
        <p>Date: {certificateData.date || "Date"}</p>
        <p>Issuer: {certificateData.issuer || "Issuer"}</p>
        <p>ID: {certificateData.certificateNumber || "Number"}</p>
      </div>
    </div>
  );

  const renderTemplate3 = () => (
    <div className="certificate-content template3">
      <div className="template3-header">
        {certificateData.logo && (
          <img
            src={certificateData.logo}
            alt="Logo"
            className="certificate-logo"
          />
        )}
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      </div>
      <div className="template3-body">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <div className="template3-details">
          <p>{certificateData.date || "Date"}</p>
          <p>{certificateData.issuer || "Issuer"}</p>
          <p>{certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate4 = () => (
    <div className="certificate-content template4">
      {certificateData.logo && (
        <img
          src={certificateData.logo}
          alt="Logo"
          className="certificate-logo"
        />
      )}
      <div className="template4-border">
        <h1>Certificate of Achievement</h1>
        <p>Proudly presented to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For outstanding performance in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template4-footer">
          <p>{certificateData.date || "Date"}</p>
          <p>{certificateData.issuer || "Issuer"}</p>
          <p>No. {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate5 = () => (
    <div className="certificate-content template5">
      <div className="template5-header">
        {certificateData.logo && (
          <img
            src={certificateData.logo}
            alt="Logo"
            className="certificate-logo"
          />
        )}
        <h1>Certification</h1>
      </div>
      <div className="template5-body">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Has demonstrated proficiency in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      </div>
      <div className="template5-footer">
        <div className="template5-detail">
          <p>Date</p>
          <p>{certificateData.date || "Date"}</p>
        </div>
        <div className="template5-detail">
          <p>Issuer</p>
          <p>{certificateData.issuer || "Issuer"}</p>
        </div>
        <div className="template5-detail">
          <p>Cert. No.</p>
          <p>{certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate6 = () => (
    <div className="certificate-content template6">
      <div className="template6-header">
        {certificateData.logo && (
          <img
            src={certificateData.logo}
            alt="Logo"
            className="certificate-logo"
          />
        )}
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      </div>
      <div className="template6-body">
        <p>Awarded to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For academic excellence in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template6-footer">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>No. {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate7 = () => (
    <div className="certificate-content template7">
      {certificateData.logo && (
        <img
          src={certificateData.logo}
          alt="Logo"
          className="certificate-logo"
        />
      )}
      <h1>Achievement</h1>
      <div className="template7-content">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Recognized for outstanding activities in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template7-details">
          <p>{certificateData.date || "Date"}</p>
          <p>{certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate8 = () => (
    <div className="certificate-content template8">
      <div className="template8-header">
        {certificateData.logo && (
          <img
            src={certificateData.logo}
            alt="Logo"
            className="certificate-logo"
          />
        )}
        <h1>Recognition</h1>
      </div>
      <div className="template8-body">
        <p>Presented to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For exceptional performance in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      </div>
      <div className="template8-footer">
        <p>Date: {certificateData.date || "Date"}</p>
        <p>Issuer: {certificateData.issuer || "Issuer"}</p>
        <p>Cert. No: {certificateData.certificateNumber || "Number"}</p>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case "template1":
        return renderTemplate1();
      case "template2":
        return renderTemplate2();
      case "template3":
        return renderTemplate3();
      case "template4":
        return renderTemplate4();
      case "template5":
        return renderTemplate5();
      case "template6":
        return renderTemplate6();
      case "template7":
        return renderTemplate7();
      case "template8":
        return renderTemplate8();
      default:
        return renderTemplate1();
    }
  };

  return (
    <Container className="py-5 col-md-12">
      <Row>
        <Col md={12}>
          <Card className="mb-4 shadow-lg">
            <Card.Header>
              <h2>Certificate Builder</h2>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="recipientName">
                  <Form.Label>Recipient Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="recipientName"
                    value={certificateData.recipientName}
                    onChange={handleChange}
                    isInvalid={!!errors.recipientName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.recipientName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="certificateTitle">
                  <Form.Label>Certificate Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="certificateTitle"
                    value={certificateData.certificateTitle}
                    onChange={handleChange}
                    isInvalid={!!errors.certificateTitle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.certificateTitle}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={certificateData.date}
                    onChange={handleChange}
                    isInvalid={!!errors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="issuer">
                  <Form.Label>Issuer *</Form.Label>
                  <Form.Control
                    type="text"
                    name="issuer"
                    value={certificateData.issuer}
                    onChange={handleChange}
                    isInvalid={!!errors.issuer}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.issuer}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="certificateNumber">
                  <Form.Label>Certificate Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="certificateNumber"
                    value={certificateData.certificateNumber}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="logo">
                  <Form.Label>Upload Logo</Form.Label>
                  <div className="logo-upload-group">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {certificateData.logo && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-2 w-25"
                        onClick={handleRemoveLogo}
                      >
                        Remove Logo
                      </Button>
                    )}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="template">
                  <Form.Label>Template</Form.Label>
                  <Form.Select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option value="template1">Template 1 (Classic)</option>
                    <option value="template2">Template 2 (Modern)</option>
                    <option value="template3">Template 3 (Minimalist)</option>
                    <option value="template4">Template 4 (Elegant)</option>
                    <option value="template5">Template 5 (Professional)</option>
                    <option value="template6">Template 6 (Academic)</option>
                    <option value="template7">Template 7 (Creative)</option>
                    <option value="template8">Template 8 (Corporate)</option>
                  </Form.Select>
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="backgroundColor">
                      <Form.Label>Background Color</Form.Label>
                      <SketchPicker
                        color={styles.backgroundColor}
                        onChangeComplete={(color) =>
                          setStyles((prev) => ({
                            ...prev,
                            backgroundColor: color.hex,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="textColor">
                      <Form.Label>Text Color</Form.Label>
                      <SketchPicker
                        color={styles.textColor}
                        onChangeComplete={(color) =>
                          setStyles((prev) => ({
                            ...prev,
                            textColor: color.hex,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="font">
                  <Form.Label>Font Family</Form.Label>
                  <Form.Select
                    value={styles.fontFamily}
                    onChange={(e) =>
                      setStyles((prev) => ({
                        ...prev,
                        fontFamily: e.target.value,
                      }))
                    }
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Brush Script MT">Brush Script MT</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" onClick={handleDownload}>
                  Download Certificate
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card
            className="certificate-preview shadow-lg"
            style={{
              ...certificateStyles,
              width: "297mm",
              height: "210mm",
              transform: "scale(0.65)",
              transformOrigin: "top center",
            }}
            ref={certificateRef}
          >
            <Card.Body className="certificate-body">
              {renderTemplate()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CertificateBuilder;
