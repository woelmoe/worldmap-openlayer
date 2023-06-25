<template>
  <div id="map" class="map">
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      {{ popupTitle }}
    </div>
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <ContextMenu @clear="clearPointers" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Map from 'ol/Map.js'
import View from 'ol/View.js'
import { Tile as TileLayer } from 'ol/layer.js'
import OSM from 'ol/source/OSM.js'
import MapBrowserEvent from 'ol/MapBrowserEvent'
import Overlay from 'ol/Overlay'
import { toStringHDMS } from 'ol/coordinate'
import { toLonLat } from 'ol/proj'
import { IconPointer } from '../use/useIconPointer'

import ContextMenu from '@/components/ContextMenu.vue'

const popupTitle = ref('')
const popup = ref()
const tileLayer = ref()
const removableLayersArray: any = []
const container = ref<HTMLElement | null>()
const closer = ref<HTMLElement | null>()

const map = ref<Map>()
const mapElement = ref<HTMLElement | null>(null)

function closePopup() {
  popup.value.setPosition(undefined)
  closer.value?.blur()
  return false
}
function createPopupFeature() {
  container.value = document.getElementById('popup')
  closer.value = document.getElementById('popup-closer')

  popup.value = new Overlay({
    element: container.value as any,
    autoPan: {
      animation: {
        duration: 250
      }
    }
  })
  if (closer.value) closer.value.onclick = closePopup
}

function clearPointers() {
  closePopup()
  if (!map.value) return
  removableLayersArray.forEach((uid: any) => {
    const layerToRemove = map.value
      ?.getAllLayers()
      .find((item: any) => item.ol_uid === uid)
    if (layerToRemove) map.value?.removeLayer(layerToRemove)
  })
  removableLayersArray.length = []
}

function handlePointerInsertion(e: MapBrowserEvent<UIEvent>) {
  console.log(e.coordinate)
  const coords = e.coordinate
  popupTitle.value = toStringHDMS(toLonLat(coords))
  popup.value.setPosition(e.coordinate)
  const pointer = new IconPointer(coords[0], coords[1]) as any
  removableLayersArray.push(pointer.layer.ol_uid)
  map.value?.addLayer(pointer.layer)
}

function createMap() {
  mapElement.value = document.getElementById('map')
  if (!mapElement) return
  tileLayer.value = new TileLayer({
    source: new OSM({
      attributions: null as any
    })
  })
  map.value = new Map({
    layers: [tileLayer.value],
    overlays: [popup.value],
    target: mapElement.value,
    view: new View({
      center: [0, 0],
      zoom: 3
    })
  })
}
function initMap() {
  createPopupFeature()
  createMap()
  map.value?.on('singleclick', handlePointerInsertion)
}

onMounted(() => {
  initMap()
})
window.onerror = (e) => {
  console.log(e)
}
</script>

<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 50px;
  left: -30px;
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
