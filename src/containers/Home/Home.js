import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Footer from '../../components/Footer/';
import Breadcrumb from '../../components/Breadcrumb/';
import Dashboard from '../../views/Dashboard/';
import Sidebar from '../../components/Sidebar/';
import Carousel from '../../components/Carousel/';

// Icons
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';

class Home extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Carousel />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/carousal" name="Carousel" component={Carousel}/>
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
