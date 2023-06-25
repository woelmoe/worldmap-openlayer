<template>
  <div id="map" class="map">
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      {{ popupTitle }}
    </div>
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import Map from 'ol/Map.js'
import VectorSource from 'ol/source/Vector.js'
import View from 'ol/View.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import OSM from 'ol/source/OSM.js'
import MapBrowserEvent from 'ol/MapBrowserEvent'
import Overlay from 'ol/Overlay'
import { toStringHDMS } from 'ol/coordinate'
import { toLonLat } from 'ol/proj'
import { IconPointer } from '../use/useIconPointer'
import { Feature } from 'ol'

const iconFeatures = reactive<Feature[]>([])
const popupTitle = ref('')
const iconLayer = ref()
const popup = ref()
const tileLayer = ref()

const map = ref()
function createPopupFeature() {
  const container = document.getElementById('popup')
  const closer = document.getElementById('popup-closer')

  popup.value = new Overlay({
    element: container as any,
    autoPan: {
      animation: {
        duration: 250
      }
    }
  })

  if (closer)
    closer.onclick = function () {
      popup.value.setPosition(undefined)
      closer.blur()
      return false
    }
}
function respawnLayers() {
  const vectorSource = new VectorSource({
    features: iconFeatures as Feature[]
  })
  iconLayer.value = new VectorLayer({
    source: vectorSource
  })
}

function initMap() {
  const mapElement = document.getElementById('map')
  if (!mapElement) return

  createPopupFeature()
  respawnLayers()
  tileLayer.value = new TileLayer({
    source: new OSM({
      attributions: null as any
    })
  })
  map.value = new Map({
    layers: [tileLayer.value, iconLayer.value],
    overlays: [popup.value],
    target: mapElement,
    view: new View({
      center: [0, 0],
      zoom: 3
    })
  })

  map.value.on('singleclick', (e: MapBrowserEvent<any>) => {
    console.log(e.coordinate)
    const coords = e.coordinate
    popupTitle.value = toStringHDMS(toLonLat(coords))
    popup.value.setPosition(e.coordinate)
    const pointer = new IconPointer(coords[0], coords[1])
    iconFeatures.push(pointer.iconFeature)
    respawnLayers()
    map.value.addLayer(iconLayer.value)
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
