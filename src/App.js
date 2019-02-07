import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecoginition from './components/FaceRecoginition/FaceRecoginition';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
//const Clarifai = require('clarifai'); //OLD METHOD TO IMPORT A PACKAGE

/*CLARIFAI IS AN API PROVIDER FOR IMAGE RECOGINITION , IT PROVIDE MANY API LIKE COLOR DELETECTION IN IMAGE,FACE DETECTION etc.*/

/*PARTICLES USED FOR THE BACKGROUND,IMPORTED FROM NPM USING  npm install particles*/
const particlesOptions = {
  particles: {
   number:{
    value:20,
    density:{
      enable:true,
      value_area:80,
    }
   }
  }
}
const initialState={
  input:'',
  imageUrl:'',
  box:{ },/*OBJECT.outputs[0].data.regions[0].region_info.bounding_box THIS REGION CONTENTS THE DETAILS WHERE THE FACE IS LOCATED INSIDE THE IMAGE*/
  route:'signin',
  isSignedIn:false,

  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    oined:'',
  }
}
class App extends Component {
  constructor(){
    super();/*WITH THE HELp OF SUPER() WE CAN ACCEESS this HERE,The super keyword is used to access and call functions on an object's parent.*/
    this.state=initialState; 
  }
  /*componentDidMount(){
    fetch('http://localhost:3000/')
      .then(response=>response.json())
      .then(console.log)
  }*/
  loadUser=(data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:0,
      joined:data.joined ,
    }})
  }
  onInputChange=(event)=>{
   this.setState({
     input:event.target.value, 
   })
  }
  calculateFaceLocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image =document.getElementById('inputimage');
    const width =  Number(image.width);
    const height = Number(image.height);
    //console.log(height,width); 
    return{
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height),
    }
  }
  displayFaceBox=(box)=>{
    this.setState({box:box,})
    console.log(box);   
  }
  /*calling app.models..(...,this.state.imageUrl) gives an error because Calling setState() in React is asynchronous, for various reasons (mainly performance). Under the covers React will batch multiple calls to setState() into a single call, and then re-render the component a single time, rather than re-rendering for every state change. Therefore the imageUrl parameter would have never worked in our example, because when we called Clarifai with our the predict function, React wasn't finished updating the state. */
  onButtonSubmit=()=>{
    this.setState({
      imageUrl:this.state.input,
    })
    /*app.models.predict(Clarifai."MODELS", "URL") THERE ARE MANY DIFFERENT MODELS, SUCH AS COLOR_MODEL (USED TO DETECT COLORS IN AN IMAGE,HERE USED FACE_DETECT_MODEL, FOR MORE INFORMATION VISIT CLARIFAI API DOCUMENTATION)*/
  fetch('http://localhost:3000/imageurl',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        input:this.state.input,
    })
  })
  .then(response=>response.json())
  .then(response =>{//console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        if(response){
         fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
              id:this.state.user.id,
            })
          })
          .then(response =>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}));
          })
          .catch(console.log);
        }
     this.displayFaceBox(this.calculateFaceLocation(response))
     })
    .catch(err=>console.log(err));
  }
  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState(initialState);
      //console.log(this.initialState.route);
    }
    else if(route==='home'){
      this.setState({
        isSignedIn:true,
        route:route,
      })
    }else{
      this.setState({
        route:route,
      })
    }
  }
  render() {
    const {isSignedIn,imageUrl,route,box}=this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { (route === 'signin' || route ==='')
          ?<div>
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          </div>
          :( route==='register'
            ?<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
            :<div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecoginition box={box}imageUrl={imageUrl}/>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
