<template>
  <div id="map" class="map">
    <div id="popup" class="ol-popup">234234</div>
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Feature from 'ol/Feature.js'
import Map from 'ol/Map.js'
import Point from 'ol/geom/Point.js'
import VectorSource from 'ol/source/Vector.js'
import View from 'ol/View.js'
import { Icon, Style } from 'ol/style.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import OSM from 'ol/source/OSM.js'
import MapBrowserEvent from 'ol/MapBrowserEvent'
import Overlay from 'ol/Overlay'

function initMap() {
  const mapElement = document.getElementById('map')
  if (!mapElement) return

  const container = document.getElementById('popup')
  const closer = document.getElementById('popup-closer')

  /**
   * Create an overlay to anchor the popup to the map.
   */
  const popup = new Overlay({
    element: container as any,
    autoPan: {
      animation: {
        duration: 250
      }
    }
  })

  if (closer) {
    closer.onclick = function () {
      popup.setPosition(undefined)
      closer.blur()
      return false
    }
  }

  const iconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
  })

  const iconStyle = new Style({
    image: new Icon({
      anchor: [3, 0],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      width: 50,
      src: 'src/assets/icons/point.svg'
    })
  })

  iconFeature.setStyle(iconStyle)

  const vectorSource = new VectorSource({
    features: [iconFeature]
  })

  const vectorLayer = new VectorLayer({
    source: vectorSource
  })

  const tileLayer = new TileLayer({
    source: new OSM()
  })

  const map = new Map({
    layers: [tileLayer, vectorLayer],
    overlays: [popup],
    target: mapElement,
    view: new View({
      center: [0, 0],
      zoom: 3
    })
  })

  interface IMapHTMLElement extends HTMLElement {
    style: CSSStyleDeclaration
  }
  // change mouse cursor when over marker
  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent)
    const hit = map.hasFeatureAtPixel(pixel)
    const mapTarget = map.getTarget() as IMapHTMLElement
    if (!mapTarget) return
    const mapTargetStyle = mapTarget.style
    mapTargetStyle.cursor = hit ? 'pointer' : ''
  })

  map.on('singleclick', (e: MapBrowserEvent<any>) => {
    console.log(e.coordinate)
    popup.setPosition(e.coordinate)
  })
}

onMounted(() => {
  initMap()
})
</script>

<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: '✖';
}
</style>
