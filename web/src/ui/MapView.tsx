import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import type { Layer, PickingInfo } from "@deck.gl/core";
import type { Dataset } from "../data/load";

export interface Overlays {
  provincias: boolean;
  rutas: boolean;
  ferrocarril: boolean;
  alta_tension: boolean;
  rios: boolean;
  areas_protegidas: boolean;
  plan_dhi: boolean;
}

export interface MapProps {
  ds: Dataset;
  /** RGBA por celda (alpha 0 = no dibujar) */
  colors: Uint8Array;
  colorKey: string;
  geo: Record<string, GeoJSON.FeatureCollection | undefined>;
  overlays: Overlays;
  depFill?: { colorOf: (f: GeoJSON.Feature) => [number, number, number, number]; key: string } | null;
  highlight: number[];
  selected: number | null;
  flyTo: { center: [number, number]; zoom: number; key: number } | null;
  onCellClick: (i: number | null) => void;
  onDepClick?: (f: GeoJSON.Feature | null) => void;
  dark: boolean;
}

const IGN_TMS = (layer: string) =>
  `https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/${layer}@EPSG%3A3857@png/{z}/{x}/{y}.png`;

function baseStyle(dark: boolean): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      ign: {
        type: "raster",
        tiles: [IGN_TMS(dark ? "argenmap_oscuro" : "mapabase_gris")],
        scheme: "tms",
        tileSize: 256,
        attribution:
          '<a href="https://www.ign.gob.ar/" target="_blank" rel="noopener">Instituto Geográfico Nacional</a>',
      },
    },
    layers: [
      // color del mar en los mosaicos del IGN, para que no se note el borde de su cobertura
      { id: "bg", type: "background", paint: { "background-color": dark ? "#2b2b2b" : "#bfbfbf" } },
      { id: "ign", type: "raster", source: "ign" },
    ],
  };
}

const LINE_STYLE: Record<string, { color: [number, number, number, number]; width: number }> = {
  rutas: { color: [82, 81, 78, 200], width: 1.2 },
  ferrocarril: { color: [98, 80, 214, 220], width: 1.2 },
  alta_tension: { color: [201, 133, 0, 230], width: 1.2 },
  rios: { color: [42, 120, 214, 230], width: 1.4 },
};

export default function MapView(p: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const handlers = useRef(p);
  handlers.current = p;

  useEffect(() => {
    const map = new maplibregl.Map({
      container: ref.current!,
      style: baseStyle(p.dark),
      center: [-64.5, -38.5],
      zoom: 3.6,
      minZoom: 2.5,
      maxZoom: 11,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    const overlay = new MapboxOverlay({ interleaved: false, layers: [] });
    map.addControl(overlay);
    mapRef.current = map;
    overlayRef.current = overlay;
    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapRef.current?.setStyle(baseStyle(p.dark));
  }, [p.dark]);

  useEffect(() => {
    if (p.flyTo) mapRef.current?.flyTo({ center: p.flyTo.center, zoom: p.flyTo.zoom, speed: 1.6 });
  }, [p.flyTo]);

  useEffect(() => {
    const { ds } = p;
    const idx: number[] = [];
    for (let i = 0; i < ds.n; i++) if (p.colors[i * 4 + 3] > 0) idx.push(i);
    const layers: Layer[] = [];

    if (p.depFill && p.geo.departamentos) {
      layers.push(
        new GeoJsonLayer({
          id: "deps",
          data: p.geo.departamentos,
          filled: true,
          stroked: true,
          getFillColor: p.depFill.colorOf as never,
          getLineColor: p.dark ? [26, 26, 25, 160] : [252, 252, 251, 200],
          lineWidthMinPixels: 0.5,
          pickable: true,
          updateTriggers: { getFillColor: p.depFill.key },
          onClick: (info: PickingInfo) => handlers.current.onDepClick?.((info.object as GeoJSON.Feature) ?? null),
        }),
      );
    } else {
      layers.push(
        new H3HexagonLayer<number>({
          id: "cells",
          data: idx,
          getHexagon: (i) => ds.h3[i],
          getFillColor: (i) => [p.colors[i * 4], p.colors[i * 4 + 1], p.colors[i * 4 + 2], p.colors[i * 4 + 3]],
          highPrecision: false,
          extruded: false,
          stroked: false,
          pickable: true,
          updateTriggers: { getFillColor: p.colorKey },
          onClick: (info: PickingInfo) =>
            handlers.current.onCellClick(info.object === undefined ? null : (info.object as number)),
        }),
      );
    }

    if (p.overlays.areas_protegidas && p.geo.areas_protegidas) {
      layers.push(
        new GeoJsonLayer({
          id: "ap",
          data: p.geo.areas_protegidas,
          filled: true,
          getFillColor: (f: GeoJSON.Feature) =>
            f.properties?.categoria === "estricta" ? [0, 131, 0, 60] : [0, 131, 0, 22],
          getLineColor: [0, 131, 0, 200],
          lineWidthMinPixels: 0.8,
        }),
      );
    }
    for (const k of ["rios", "rutas", "ferrocarril", "alta_tension"] as const) {
      if (p.overlays[k] && p.geo[k]) {
        layers.push(
          new GeoJsonLayer({
            id: k,
            data: p.geo[k],
            stroked: true,
            filled: false,
            getLineColor: LINE_STYLE[k].color,
            lineWidthMinPixels: LINE_STYLE[k].width,
            lineWidthUnits: "pixels",
          }),
        );
      }
    }
    if (p.overlays.plan_dhi && p.geo.plan_dhi) {
      layers.push(
        new GeoJsonLayer({
          id: "plan_dhi",
          data: p.geo.plan_dhi,
          pointType: "circle+text",
          getPointRadius: 7,
          pointRadiusUnits: "pixels",
          getFillColor: (f: GeoJSON.Feature) => (f.properties?.tipo === "obra" ? [235, 104, 52, 240] : [27, 175, 122, 240]),
          getLineColor: [255, 255, 255, 255],
          lineWidthMinPixels: 1.5,
          stroked: true,
          getText: (f: GeoJSON.Feature) => String(f.properties?.nombre ?? "").replace(" (zona de chacras)", ""),
          getTextSize: 11,
          getTextPixelOffset: [0, -14],
          getTextColor: p.dark ? [240, 239, 236, 255] : [11, 11, 11, 255],
          textFontWeight: 600,
          textOutlineWidth: 3,
          textOutlineColor: p.dark ? [26, 26, 25, 255] : [252, 252, 251, 255],
          textFontSettings: { sdf: true },
          textCharacterSet: "auto",
        }),
      );
    }
    if (p.overlays.provincias && p.geo.provincias) {
      layers.push(
        new GeoJsonLayer({
          id: "prov",
          data: p.geo.provincias,
          filled: false,
          stroked: true,
          getLineColor: p.dark ? [240, 239, 236, 150] : [11, 11, 11, 130],
          lineWidthMinPixels: 1,
        }),
      );
    }
    if (p.highlight.length) {
      layers.push(
        new H3HexagonLayer<number>({
          id: "hl",
          data: p.highlight,
          getHexagon: (i) => ds.h3[i],
          filled: false,
          stroked: true,
          extruded: false,
          getLineColor: p.dark ? [240, 239, 236, 255] : [11, 11, 11, 255],
          lineWidthMinPixels: 1.5,
        }),
      );
    }
    if (p.selected !== null) {
      layers.push(
        new H3HexagonLayer<number>({
          id: "sel",
          data: [p.selected],
          getHexagon: (i) => ds.h3[i],
          filled: false,
          stroked: true,
          extruded: false,
          getLineColor: [227, 73, 72, 255],
          lineWidthMinPixels: 3,
        }),
      );
    }
    overlayRef.current?.setProps({
      layers,
      getCursor: ({ isHovering }) => (isHovering ? "pointer" : "grab"),
    });
  }, [p.ds, p.colors, p.colorKey, p.geo, p.overlays, p.depFill, p.highlight, p.selected, p.dark]);

  return <div ref={ref} className="map" role="region" aria-label="Mapa de Argentina" />;
}
