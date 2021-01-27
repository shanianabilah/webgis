import './App.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Polygon, LayerGroup, Polyline, FeatureGroup, GeoJSON } from 'react-leaflet'
import axios from 'axios';
import React from 'react';

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      points:null,
      lines: null,
      polygons: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    await axios
      .all([
        axios.get(
          `http://localhost:8080/points`
        ),
        axios.get(
          `http://localhost:8080/lines`
        ),
        axios.get(`http://localhost:8080/polygons`)
      ])
      .then(responseArr => {
        const points = responseArr[0].data.points.features;
        const lines = responseArr[1].data.lines.features;
        const polygons = responseArr[2].data.polygons.features;
        this.setState({points:points})
        this.setState({lines})
        this.setState({polygons})
      });
  };
  
  render() {
    const center = [51.505, -0.09]
    return(
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style= {{height:'100vh', width:'100%'}}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Points">
            {/* {this.state.points && (
              <GeoJSON data={this.state.points} />
            )} */}
            <FeatureGroup>
              {this.state.points && this.state.points.map((val,idx) => (
                  <Marker position={this.state.points[idx].geometry.coordinates}>
                    <Popup>{this.state.points[idx].properties.f2}</Popup>
                  </Marker>
              ))}
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Lines">
            {/* {this.state.lines && (
              <GeoJSON data={this.state.lines} />
            )} */}
            <FeatureGroup >
              {this.state.lines && this.state.lines.map((val,idx) => (
                <Polyline pathOptions={{ color: 'purple' }} positions={this.state.lines[idx].geometry.coordinates} >
                  <Popup>
                    Name:{this.state.lines[idx].properties.f2}<br />
                    Length: {this.state.lines[idx].properties.f3}<br />
                    Description: {this.state.lines[idx].properties.f4}
                  </Popup>
                </Polyline>
              ))}
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Polygon">
            {/* {this.state.polygons && (
              <GeoJSON data={this.state.polygons} />
            )} */}
            <FeatureGroup>
              {this.state.polygons && this.state.polygons.map((val,idx) => (
                <Polygon pathOptions={{ color: 'purple' }} positions={this.state.polygons[idx].geometry.coordinates} >
                  <Popup>
                    Name:{this.state.polygons[idx].properties.f2}<br />
                    Area: {this.state.polygons[idx].properties.f3}<br />
                    Description: {this.state.polygons[idx].properties.f4}
                  </Popup>
                </Polygon>
              ))}
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    );
  }
}
