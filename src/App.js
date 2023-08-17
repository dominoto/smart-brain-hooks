import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
  MODEL_ID: "face-detection",
  MODEL_VERSION_ID: "6dc7e46bc9124c5c8824be4822abe105",
  PAT: process.env.REACT_APP_PAT,
  USER_ID: process.env.REACT_APP_USER_ID,
  APP_ID: process.env.REACT_APP_APP_ID,
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    // this.setState({ imageUrl: this.state.input });

    // Data for Clarifai REST endpoint
    const raw = JSON.stringify({
      user_app_id: {
        // user_id: process.env.USER_ID,
        // app_id: process.env.APP_ID,
        user_id: this.state.USER_ID,
        app_id: this.state.APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              // url: this.state.imageUrl,
              url: this.state.input,
            },
          },
        },
      ],
    });
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        // Authorization: "Key " + process.env.PAT,
        Authorization: "Key " + this.state.PAT,
      },
      body: raw,
    };

    // Fetch from Clarifai REST endpoint
    fetch(
      "https://api.clarifai.com/v2/models/" + this.state.MODEL_ID + "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);

        if (response) {
          fetch("https://smart-brain-api-x77e.onrender.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => {
              response.json();
            })
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
