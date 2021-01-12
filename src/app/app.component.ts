import { Component } from '@angular/core';
import { Feature, GeoJsonObject, Geometry } from 'geojson';
import * as L from 'leaflet';
import {states} from '../assets/geo-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  states = states;
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 6,
    center: L.latLng(37.9, 23.7)
  };

  onMapReady(map: L.Map): void {

    const info = new L.Control();

    const update = (props?) => {
      info.onAdd = () => {
        const infoDiv = L.DomUtil.create('div', 'info');
        infoDiv.innerHTML = '<h4>Greece Population</h4>' + (props ?
        '<b>' + props.name_el + '</b><br />' + props.population + ' people'
        : 'Hover over a district');
        return infoDiv;
      };
      info.addTo(map);
    };

    update();

    const highlightFeature = e => {
      const layer = e.target;

      layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      update(layer.feature.properties);
    };

    const resetHighlight = e => {
      geojson.resetStyle(e.target);
      update();
    };

    const zoomToFeature = e => {
      // map.fitBounds(e.target.getBounds());
    };

    const onEachFeature = (feature: Feature<Geometry, any>, layer: L.Layer) => {
      layer.bindPopup(feature.properties.name_el);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    };

    const style = feature => {
      return {
        weight: 2,
        opacity: 1,
        // color: '#666',
        // dashArray: '3',
        // fillOpacity: 0.7,
        // fillColor: getColor(feature.properties.density)
      };
    };

    const geojson = L.geoJSON(this.states as GeoJsonObject, {
      style,
      onEachFeature
    }).addTo(map);

    map.attributionControl.addAttribution('<img width="10" src="https://simpleicons.org/icons/github.svg" alt="code"/><a href="https://github.com/sakmanal"> Github</a>');

    // get color depending on population density value
    const getColor = (d: number) => {
      return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
          d > 200 ? '#E31A1C' :
            d > 100 ? '#FC4E2A' :
              d > 50 ? '#FD8D3C' :
                d > 20 ? '#FEB24C' :
                  d > 10 ? '#FED976' :
                    '#FFEDA0';
      };

    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = () => {

      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
      const labels = [];

      for (let i = 0; i < grades.length; i++) {
        const from = grades[i];
        const to = grades[i + 1];

        labels.push(
          '<i style="background:' + getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);


  }
}
