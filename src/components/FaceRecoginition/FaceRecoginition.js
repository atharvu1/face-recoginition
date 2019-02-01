import React from 'react';
import './FaceRecoginition.css';
const FaceRecoginition = ({box,imageUrl}) => {/*INSTEAD OF PASSING PROPS IN THE FUNCTION WE USED DESTRUCTURE,that makes it possible to unpack values from arrays, or properties from objects, into distinct variables*/
	return(
	       <div className='center ma'>
	       	<div className="absolute mt2 ">
	       		<img id='inputimage' src={imageUrl} alt="" width="500px" height = "auto"/>
	       		<div className='bounding-box' style={{top:box.topRow,right:box.rightCol,bottom:box.bottomRow,left:box.leftCol}}>
	       			
	       		</div>
	       	</div>
	       </div> 
	);
}  
export default FaceRecoginition; 