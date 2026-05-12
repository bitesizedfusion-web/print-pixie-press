// Client-only Konva canvas. Imported dynamically from the route to avoid SSR.
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
  Circle,
  Line,
} from "react-konva";
import { useEffect, useRef } from "react";
import useImage from "use-image";
import type Konva from "konva";

export type Tool = "select" | "text" | "rect" | "circle" | "line" | "image";

export type DesignElement =
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize: number;
      fontFamily: string;
      fill: string;
      fontStyle?: string;
      align?: "left" | "center" | "right";
      width?: number;
      rotation?: number;
    }
  | {
      id: string;
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      cornerRadius?: number;
      rotation?: number;
    }
  | {
      id: string;
      type: "circle";
      x: number;
      y: number;
      radius: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      rotation?: number;
    }
  | {
      id: string;
      type: "line";
      points: number[];
      stroke: string;
      strokeWidth: number;
      x?: number;
      y?: number;
      rotation?: number;
    }
  | {
      id: string;
      type: "image";
      x: number;
      y: number;
      width: number;
      height: number;
      src: string;
      rotation?: number;
    };

interface CanvasImageProps {
  el: Extract<DesignElement, { type: "image" }>;
  onSelect: () => void;
  onChange: (e: DesignElement) => void;
  isSelected: boolean;
}

function CanvasImage({ el, onSelect, onChange }: CanvasImageProps) {
  const [img] = useImage(el.src, "anonymous");
  return (
    <KonvaImage
      id={el.id}
      image={img}
      x={el.x}
      y={el.y}
      width={el.width}
      height={el.height}
      rotation={el.rotation ?? 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ ...el, x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node = e.target;
        const sx = node.scaleX();
        const sy = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...el,
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * sx),
          height: Math.max(20, node.height() * sy),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

interface DesignerCanvasProps {
  width: number;
  height: number;
  bgColor: string;
  elements: DesignElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (el: DesignElement) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function DesignerCanvas({
  width,
  height,
  bgColor,
  elements,
  selectedId,
  onSelect,
  onChange,
  stageRef,
}: DesignerCanvasProps) {
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (!stage || !tr) return;
    if (selectedId) {
      const node = stage.findOne(`#${selectedId}`);
      tr.nodes(node ? [node] : []);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, elements, stageRef]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={(e) => {
        // Click on empty area => deselect
        if (e.target === e.target.getStage()) onSelect(null);
      }}
      onTouchStart={(e) => {
        if (e.target === e.target.getStage()) onSelect(null);
      }}
    >
      <Layer>
        <Rect x={0} y={0} width={width} height={height} fill={bgColor} listening={false} />
        {elements.map((el) => {
          if (el.type === "text") {
            return (
              <Text
                key={el.id}
                id={el.id}
                x={el.x}
                y={el.y}
                text={el.text}
                fontSize={el.fontSize}
                fontFamily={el.fontFamily}
                fill={el.fill}
                fontStyle={el.fontStyle ?? "normal"}
                align={el.align ?? "left"}
                width={el.width}
                rotation={el.rotation ?? 0}
                draggable
                onClick={() => onSelect(el.id)}
                onTap={() => onSelect(el.id)}
                onDragEnd={(e) => onChange({ ...el, x: e.target.x(), y: e.target.y() })}
                onTransformEnd={(e) => {
                  const node = e.target as Konva.Text;
                  const sx = node.scaleX();
                  node.scaleX(1);
                  node.scaleY(1);
                  onChange({
                    ...el,
                    x: node.x(),
                    y: node.y(),
                    fontSize: Math.max(8, Math.round(el.fontSize * sx)),
                    rotation: node.rotation(),
                  });
                }}
              />
            );
          }
          if (el.type === "rect") {
            return (
              <Rect
                key={el.id}
                id={el.id}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                fill={el.fill}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth}
                cornerRadius={el.cornerRadius}
                rotation={el.rotation ?? 0}
                draggable
                onClick={() => onSelect(el.id)}
                onTap={() => onSelect(el.id)}
                onDragEnd={(e) => onChange({ ...el, x: e.target.x(), y: e.target.y() })}
                onTransformEnd={(e) => {
                  const node = e.target as Konva.Rect;
                  const sx = node.scaleX();
                  const sy = node.scaleY();
                  node.scaleX(1);
                  node.scaleY(1);
                  onChange({
                    ...el,
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(10, node.width() * sx),
                    height: Math.max(10, node.height() * sy),
                    rotation: node.rotation(),
                  });
                }}
              />
            );
          }
          if (el.type === "circle") {
            return (
              <Circle
                key={el.id}
                id={el.id}
                x={el.x}
                y={el.y}
                radius={el.radius}
                fill={el.fill}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth}
                rotation={el.rotation ?? 0}
                draggable
                onClick={() => onSelect(el.id)}
                onTap={() => onSelect(el.id)}
                onDragEnd={(e) => onChange({ ...el, x: e.target.x(), y: e.target.y() })}
                onTransformEnd={(e) => {
                  const node = e.target as Konva.Circle;
                  const sx = node.scaleX();
                  node.scaleX(1);
                  node.scaleY(1);
                  onChange({
                    ...el,
                    x: node.x(),
                    y: node.y(),
                    radius: Math.max(5, el.radius * sx),
                    rotation: node.rotation(),
                  });
                }}
              />
            );
          }
          if (el.type === "line") {
            return (
              <Line
                key={el.id}
                id={el.id}
                x={el.x ?? 0}
                y={el.y ?? 0}
                points={el.points}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth}
                rotation={el.rotation ?? 0}
                lineCap="round"
                draggable
                onClick={() => onSelect(el.id)}
                onTap={() => onSelect(el.id)}
                onDragEnd={(e) => onChange({ ...el, x: e.target.x(), y: e.target.y() })}
              />
            );
          }
          return (
            <CanvasImage
              key={el.id}
              el={el}
              isSelected={selectedId === el.id}
              onSelect={() => onSelect(el.id)}
              onChange={onChange}
            />
          );
        })}
        <Transformer
          ref={trRef}
          rotateEnabled
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
}
