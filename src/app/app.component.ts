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
        minZoom: 6,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
    ],
    zoom: 6,
    center: L.latLng(37.9, 23.7)
  };

  onMapReady(map: L.Map): void {

    const bounds = L.latLngBounds([[30, 15], [45, 40]]);
    map.setMaxBounds(bounds);

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
        weight: 3,
        color: '#616DE2',
        dashArray: '',
        fillOpacity: 0.7,
        // fillColor: '#666'
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

    // get color depending on population density value
    const getColor = (d: number) => {
      return d > 1000000 ? '#800026' :
        d > 500000 ? '#BD0026' :
          d > 200000 ? '#E31A1C' :
            d > 150000 ? '#FC4E2A' :
              d > 100000 ? '#FD8D3C' :
                d > 90000 ? '#FEB24C' :
                  d > 50000 ? '#FED976' :
                    '#FFEDA0';
    };

    const style = feature => {
      return {
        weight: 2,
        opacity: 1,
        color: '#666',
        // dashArray: '3',
        fillOpacity: 0.5,
        fillColor: getColor(feature.properties.population)
      };
    };

    const geojson = L.geoJSON(this.states as GeoJsonObject, {
      style,
      onEachFeature
    }).addTo(map);

    map.attributionControl.addAttribution('<img width="10" src="https://simpleicons.org/icons/github.svg" alt="code"/><a href="https://github.com/sakmanal"> Github</a>');


    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = () => {

      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 50000, 90000, 100000, 150000, 200000, 500000, 1000000];
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
