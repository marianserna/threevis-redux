import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { TweenMax } from 'gsap';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showProjectImage, hideProjectImage } from '../actions';
import projects from '../projects.js';
import Header from './Header';
import Footer from './Footer';
import Scene from '../Scene';

class Main extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    positionX: PropTypes.number.isRequired,
    positionY: PropTypes.number.isRequired,
    projectKey: PropTypes.string.isRequired,
    showProjectImage: PropTypes.func.isRequired,
    hideProjectImage: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.scene = new Scene(
      this.container,
      this.props.showProjectImage,
      this.props.hideProjectImage
    );

    this.preloadImages();
    this.hideOnEscape();
  }

  preloadImages = () => {
    Object.keys(projects).forEach(key => {
      const image = new Image();
      image.src = projects[key].image;
    });
  };

  hideOnEscape = () => {
    document.addEventListener('keydown', e => {
      if (e.code === 'Escape') {
        this.props.hideProjectImage();
      }
    });
  };

  render() {
    return (
      <Fragment>
        <Header />
        <section className="scene-container">
          <div ref={div => (this.container = div)} />

          {this.props.visible ? (
            <div
              className="projectImage"
              style={{
                top: this.props.positionY,
                left: this.props.positionX
              }}
            >
              <Link to={`/projects/${this.props.projectKey}`}>
                <img
                  src={projects[this.props.projectKey].image}
                  alt={projects[this.props.projectKey]}
                />
              </Link>
            </div>
          ) : (
            ''
          )}
        </section>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    visible: state.visible,
    positionX: state.positionX,
    positionY: state.positionY,
    projectKey: state.projectKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showProjectImage: (key, x, y) => {
      dispatch(showProjectImage(key, x, y));
    },
    hideProjectImage: () => {
      dispatch(hideProjectImage());
    }
  };
};

// const connectFunction = connect(mapStateToProps, mapDispatchToProps);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
