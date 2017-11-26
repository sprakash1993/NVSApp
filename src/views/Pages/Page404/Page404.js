import React, {Component} from 'react';
import {Container, Row, Col, Button, Input, InputGroupAddon, InputGroup, InputGroupButton} from 'reactstrap';
import Carousel from '../../../components/Carousel';

class Page404 extends Component {
  render() {
    return (
      <div>
        <Carousel />
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="6">
                <div className="clearfix">
                  <h1 className="float-left display-3 mr-4">404</h1>
                  <h4 className="pt-3">Oops! You are lost.</h4>
                  <p className="text-muted float-left">The page you are looking for was not found.</p>
                </div>
                <InputGroup className="input-prepend">
                  <InputGroupAddon><i className="fa fa-search"></i></InputGroupAddon>
                  <Input size="16" type="text" placeholder="What are you looking for?"/>
                  <InputGroupButton>
                    <Button color="info">Search</Button>
                  </InputGroupButton>
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Page404;
