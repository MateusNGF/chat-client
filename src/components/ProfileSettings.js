import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";

export function ProfileSettingModal({ show = true, incomingContent, onSubmit }) {
    const [formData, setFormData] = useState(incomingContent || {});
    const [selectedImage, setSelectedImage] = useState(formData.profilePicture || '');
  
    useEffect(() => {
      setFormData(incomingContent || {});
      setSelectedImage(incomingContent?.profilePicture || '');
    }, [incomingContent]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleImageSelect = (url) => {
      setSelectedImage(url);
      setFormData((prev) => ({ ...prev, picture: url }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit && onSubmit(formData);
    };
  
    const pictures = Array.from({ length: 6 }, (_, i) => (
      { url : `https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava${i + 1}-bg.webp` }
    ));
  
    return (
      <Modal show={show} centered>
        <Modal.Header>
          <Modal.Title>Quem é você?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Nome de usuário:</Form.Label>
              <Form.Control
                name="username"
                value={formData.username || ''}
                type="text"
                placeholder="XaulinMatadorDePorco"
                autoFocus
                onChange={handleChange}
                required
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="profilePicture">
              <Form.Label>Foto de perfil:</Form.Label>
              <Row>
                {pictures.map((picture, index) => (
                  <Col xs={4} sm={4} md={2} key={index} className="mb-3">
                    <Card
                      style={{ 
                          cursor: 'pointer', 
                          borderRadius: '100px', 
                          border: selectedImage === picture.url ? '2px solid #007bff' : 'none' }}
                      onClick={() => handleImageSelect(picture.url)}
                    >
                      <Card.Img variant="top" src={picture.url} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Form.Group>
            
            <Button type="submit" variant="primary">
              Entrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }