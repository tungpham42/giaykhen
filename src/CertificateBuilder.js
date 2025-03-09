import React, { useState, useRef, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import html2canvas from "html2canvas";
import { SketchPicker } from "react-color";
import "./CertificateBuilder.css";

const CertificateBuilder = () => {
  const [certificateData, setCertificateData] = useState({
    recipientName: "",
    certificateTitle: "",
    date: "",
    issuer: "",
    certificateNumber: "",
  });

  const [styles, setStyles] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    titleColor: "#2c3e50",
    fontFamily: "Arial",
  });

  const [template, setTemplate] = useState("template1");
  const [errors, setErrors] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
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

  const handleDownload = useCallback(async () => {
    if (!validateForm()) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const element = certificateRef.current;
      if (!element) throw new Error("Certificate element not found");

      // Ensure the element is fully rendered before capturing
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dynamically calculate scale and dimensions for mobile
      const isMobile = window.innerWidth <= 768;
      const scaleFactor = isMobile
        ? Math.min(window.devicePixelRatio, 1.5)
        : Math.min(window.devicePixelRatio, 2);
      const width = element.scrollWidth;
      const height = element.scrollHeight;

      const canvas = await html2canvas(element, {
        scale: scaleFactor,
        useCORS: true, // Enforce CORS for external resources
        allowTaint: true, // Disable tainting for security
        logging: false,
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        backgroundColor: styles.backgroundColor, // Ensure background is captured
      });

      // Convert canvas to PNG and trigger download
      const imgData = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Certificate_${Date.now()}.png`; // Unique filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadError(
        `Failed to generate certificate: ${error.message}. Please try again.`
      );
    } finally {
      setIsDownloading(false);
    } // eslint-disable-next-line
  }, [styles, certificateData]);

  const certificateStyles = {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    fontFamily: styles.fontFamily,
  };

  const isMobile = window.innerWidth <= 768;
  const previewStyles = {
    ...certificateStyles,
    width: isMobile ? "100%" : "297mm", // Full width on mobile
    height: isMobile ? "auto" : "210mm", // Auto height on mobile
    transform: isMobile ? "none" : "scale(1)", // No scaling on mobile
    transformOrigin: "top left",
    overflow: "hidden",
    padding: isMobile ? "10px" : "0", // Add padding for mobile
  };

  // Modified templates without logo
  const renderTemplate1 = () => (
    <div className="certificate-content template1">
      <div className="template1-decoration"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <p className="template1-subtitle">This certifies that</p>
      <h2>{certificateData.recipientName || "Recipient Name"}</h2>
      <p>has successfully completed</p>
      <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      <div className="template1-details">
        <p>Issued on: {certificateData.date || "Date"}</p>
        <p>By: {certificateData.issuer || "Issuer"}</p>
        <p>Certificate #: {certificateData.certificateNumber || "Number"}</p>
      </div>
    </div>
  );

  const renderTemplate2 = () => (
    <div className="certificate-content template2">
      <div className="template2-overlay"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
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
      <div className="template4-border">
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
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
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
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
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
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
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
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

  const renderTemplate9 = () => (
    <div className="certificate-content template9">
      <div className="template9-background"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template9-content">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Awarded for exceptional achievement in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template9-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate10 = () => (
    <div className="certificate-content template10">
      <div className="template10-overlay"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template10-content">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Recognized for mastery in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template10-details">
          <div className="template10-detail-item">
            <span>Date:</span>
            <span>{certificateData.date || "Date"}</span>
          </div>
          <div className="template10-detail-item">
            <span>Issuer:</span>
            <span>{certificateData.issuer || "Issuer"}</span>
          </div>
          <div className="template10-detail-item">
            <span>ID:</span>
            <span>{certificateData.certificateNumber || "Number"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplate11 = () => (
    <div className="certificate-content template11">
      <div className="template11-overlay"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template11-content">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For outstanding contribution to</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template11-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate12 = () => (
    <div className="certificate-content template12">
      <div className="template12-splash"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template12-content">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Awarded for creativity in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template12-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate13 = () => (
    <div className="certificate-content template13">
      <div className="template13-border"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template13-content">
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Recognized for excellence in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template13-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate14 = () => (
    <div className="certificate-content template14">
      <div className="template14-frame"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template14-content">
        <p>Hereby awarded to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For exemplary achievement in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template14-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate15 = () => (
    <div className="certificate-content template15">
      <div className="template15-header">
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      </div>
      <div className="template15-body">
        <p>Presented to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>In recognition of outstanding performance in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      </div>
      <div className="template15-footer">
        <p>Issued on: {certificateData.date || "Date"}</p>
        <p>By: {certificateData.issuer || "Issuer"}</p>
        <p>Certificate No: {certificateData.certificateNumber || "Number"}</p>
      </div>
    </div>
  );

  const renderTemplate16 = () => (
    <div className="certificate-content template16">
      <div className="template16-accent"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template16-content">
        <p>Awarded to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For excellence in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template16-details">
          <p>{certificateData.date || "Date"}</p>
          <p>{certificateData.issuer || "Issuer"}</p>
          <p>{certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate17 = () => (
    <div className="certificate-content template17">
      <div className="template17-border"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template17-content">
        <p>This certificate is proudly presented to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For distinguished achievement in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template17-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>Certificate ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate18 = () => (
    <div className="certificate-content template18">
      <div className="template18-header">
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      </div>
      <div className="template18-body">
        <p>Awarded to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For innovative contributions to</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      </div>
      <div className="template18-footer">
        <p>Date: {certificateData.date || "Date"}</p>
        <p>Issuer: {certificateData.issuer || "Issuer"}</p>
        <p>ID: {certificateData.certificateNumber || "Number"}</p>
      </div>
    </div>
  );

  const renderTemplate19 = () => (
    <div className="certificate-content template19">
      <div className="template19-overlay"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template19-content">
        <p>Conferred upon</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>In recognition of academic excellence in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template19-details">
          <p>{certificateData.date || "Date"}</p>
          <p>{certificateData.issuer || "Issuer"}</p>
          <p>{certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate20 = () => (
    <div className="certificate-content template20">
      <div className="template20-stars"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template20-content">
        <p>Awarded to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For stellar performance in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template20-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate21 = () => (
    <div className="certificate-content template21">
      <div className="template21-header">
        <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      </div>
      <div className="template21-body">
        <p>Presented to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For sustainable efforts in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
      </div>
      <div className="template21-footer">
        <p>Issued on: {certificateData.date || "Date"}</p>
        <p>By: {certificateData.issuer || "Issuer"}</p>
        <p>No: {certificateData.certificateNumber || "Number"}</p>
      </div>
    </div>
  );

  const renderTemplate22 = () => (
    <div className="certificate-content template22">
      <div className="template22-frame"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template22-content">
        <p>This is to certify that</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>Has completed with distinction</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template22-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>Certificate No: {certificateData.certificateNumber || "Number"}</p>
        </div>
      </div>
    </div>
  );

  const renderTemplate23 = () => (
    <div className="certificate-content template23">
      <div className="template23-waves"></div>
      <h1>{certificateData.certificateTitle || "Certificate Title"}</h1>
      <div className="template23-content">
        <p>Presented to</p>
        <h2>{certificateData.recipientName || "Recipient Name"}</h2>
        <p>For outstanding achievement in</p>
        <h3>{certificateData.certificateTitle || "Certificate Title"}</h3>
        <div className="template23-details">
          <p>Date: {certificateData.date || "Date"}</p>
          <p>Issuer: {certificateData.issuer || "Issuer"}</p>
          <p>ID: {certificateData.certificateNumber || "Number"}</p>
        </div>
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
      case "template9":
        return renderTemplate9();
      case "template10":
        return renderTemplate10();
      case "template11":
        return renderTemplate11();
      case "template12":
        return renderTemplate12();
      case "template13":
        return renderTemplate13();
      case "template14":
        return renderTemplate14();
      case "template15":
        return renderTemplate15();
      case "template16":
        return renderTemplate16();
      case "template17":
        return renderTemplate17();
      case "template18":
        return renderTemplate18();
      case "template19":
        return renderTemplate19();
      case "template20":
        return renderTemplate20();
      case "template21":
        return renderTemplate21();
      case "template22":
        return renderTemplate22();
      case "template23":
        return renderTemplate23();
      default:
        return renderTemplate1();
    }
  };

  return (
    <Container className="py-5">
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
                    <option value="template9">
                      Template 9 (Vibrant Celebration)
                    </option>
                    <option value="template10">
                      Template 10 (Futuristic Digital)
                    </option>
                    <option value="template11">
                      Template 11 (Nature Inspired)
                    </option>
                    <option value="template12">
                      Template 12 (Artistic Splash)
                    </option>
                    <option value="template13">
                      Template 13 (Golden Prestige)
                    </option>
                    <option value="template14">
                      Template 14 (Regal Sophistication)
                    </option>
                    <option value="template15">
                      Template 15 (Corporate Excellence)
                    </option>
                    <option value="template16">
                      Template 16 (Modern Prestige)
                    </option>
                    <option value="template17">
                      Template 17 (Timeless Elegance)
                    </option>
                    <option value="template18">
                      Template 18 (Tech Innovation)
                    </option>
                    <option value="template19">
                      Template 19 (Academic Honor)
                    </option>
                    <option value="template20">
                      Template 20 (Celestial Achievement)
                    </option>
                    <option value="template21">
                      Template 21 (Eco-Friendly Recognition)
                    </option>
                    <option value="template22">
                      Template 22 (Vintage Diploma)
                    </option>
                    <option value="template23">
                      Template 23 (Ocean Waves)
                    </option>
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
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lexend Deca">Lexend Deca</option>
                    <option value="Questrial">Questrial</option>
                    <option value="Lobster">Lobster</option>
                    <option value="Raleway">Raleway</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Dancing Script">Dancing Script</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Generating..." : "Download Certificate"}
                </Button>
                {downloadError && (
                  <Alert
                    variant="danger"
                    onClose={() => setDownloadError(null)}
                    dismissible
                  >
                    {downloadError}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card
            className="certificate-preview shadow-lg"
            style={previewStyles}
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
