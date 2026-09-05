"use client";

import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useScrapbookStore, CanvasItem } from '../store/useScrapbookStore';

const ScrapbookImage = ({ item, isSelected, onSelect, onChange }: any) => {
  const [image] = useImage(item.src || '');
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>();

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        image={image}
        x={item.x}
        y={item.y}
        scaleX={item.scaleX}
        scaleY={item.scaleY}
        rotation={item.rotation}
        draggable
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: Math.max(5, scaleX),
            scaleY: Math.max(5, scaleY),
          });
        }}
        opacity={item.isDeveloping ? 0.5 : 1}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default function CanvasWorkspace() {
  const items = useScrapbookStore((state) => state.items);
  const updateItem = useScrapbookStore((state) => state.updateItem);
  const [selectedId, selectShape] = useState<string | null>(null);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {items.map((item, i) => {
            if (item.type === 'image') {
              return (
                <ScrapbookImage
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  onSelect={() => selectShape(item.id)}
                  onChange={(newAttrs: CanvasItem) => {
                    updateItem(item.id, newAttrs);
                  }}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
